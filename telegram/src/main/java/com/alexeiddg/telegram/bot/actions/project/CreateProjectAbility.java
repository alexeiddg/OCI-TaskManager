package com.alexeiddg.telegram.bot.actions.project;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempProjectDataStore;
import com.alexeiddg.telegram.service.AppUserService;
import com.alexeiddg.telegram.service.ProjectService;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Project;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CreateProjectAbility {

    // TODO: Refresh keyboard after creation

    private final AppUserService appUserService;
    private final ProjectService projectService;
    private final UserSessionManager userSessionManager;
    private final TempProjectDataStore tempProjectDataStore;

    public void startProjectCreation(BaseAbilityBot bot, Long chatId, Long telegramUserId) {

        AppUser user = appUserService.getUserByTelegramId(telegramUserId.toString()).orElse(null);

        if (user == null) {
            bot.silent().send("❌ User not found. Please login first.", chatId);
        }

        Project project = new Project();
        project.setIsActive(true);

        assert user != null;
        if (user.getRole() == UserRole.MANAGER) {
            project.setManager(user);
        }

        tempProjectDataStore.set(telegramUserId, project);

        userSessionManager.setState(telegramUserId, UserState.PROJECT_CREATE_NAME);
        bot.silent().send("📝 Let's create a new project! Please enter the project name:", chatId);
    }

    public void handleCreateProject(BaseAbilityBot bot, Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) return;

        String text = update.getMessage().getText();
        Long chatId = update.getMessage().getChatId();
        Long telegramUserId = update.getMessage().getFrom().getId();
        UserState state = userSessionManager.getState(telegramUserId);

        Project project = tempProjectDataStore.get(telegramUserId);
        if (project == null) {
            bot.silent().send("⚠️ Something went wrong. Try 'Create Project' again.", chatId);
            userSessionManager.clearState(telegramUserId);
            return;
        }

        switch (state) {
            case PROJECT_CREATE_NAME -> {
                project.setProjectName(text);
                userSessionManager.setState(telegramUserId, UserState.PROJECT_CREATE_DESCRIPTION);
                bot.silent().send("📄 Got it. Now enter the *project description*:", chatId);
            }

            case PROJECT_CREATE_DESCRIPTION -> {
                project.setProjectDescription(text);

                if (project.getManager() == null) {
                    userSessionManager.setState(telegramUserId, UserState.PROJECT_CREATE_MANAGER);
                    bot.silent().send("Select a manager from the keyboard", chatId);
                } else {
                    userSessionManager.setState(telegramUserId, UserState.PROJECT_CREATE_TEAM_DECISION);
                    bot.silent().send("Would you like to assign a team now? (yes/no)", chatId);
                }
            }

            // TODO: Build a keyboard with all managers
            case PROJECT_CREATE_MANAGER -> {
                List<AppUser> managers = appUserService.getAllManagers();

                AppUser foundManager = managers.stream()
                        .filter(m -> text.equalsIgnoreCase(m.getUsername()))
                        .findFirst()
                        .orElse(null);

                if (foundManager == null) {
                    bot.silent().send("❌ Manager not found. Try again.", chatId);
                    return;
                }
                project.setManager(foundManager);

                userSessionManager.setState(telegramUserId, UserState.PROJECT_CREATE_TEAM_DECISION);
                bot.silent().send("Would you like to assign a team now? (yes/no)", chatId);
            }

            case PROJECT_CREATE_TEAM_DECISION -> {
                if (text.equalsIgnoreCase("yes")) {
                    userSessionManager.setState(telegramUserId, UserState.PROJECT_CREATE_TEAM_SELECT);
                    bot.silent().send(
                            "Ok, let's assign a team. Use the 'skip' button if no team is assigned to the project",
                            chatId
                    );
                } else {
                    userSessionManager.setState(telegramUserId, UserState.PROJECT_CREATE_CONFIRMATION);
                    showProjectConfirmation(bot, chatId, project);
                }
            }

            case PROJECT_CREATE_TEAM_SELECT -> {
                // TODO: Build Keyboard with all teams
            }

            case PROJECT_CREATE_CONFIRMATION -> {
                if (text.equalsIgnoreCase("confirm")) {
                    projectService.createProject(project);
                    tempProjectDataStore.clear(telegramUserId);
                    userSessionManager.setState(telegramUserId, UserState.MAIN_MENU);
                    bot.silent().send("✅ Project created successfully! Returning to Main Menu menu...", chatId);
                } else {
                    tempProjectDataStore.clear(telegramUserId);
                    userSessionManager.clearState(telegramUserId);
                    bot.silent().send("❌ Project creation canceled.", chatId);
                }
            }
        }
    }

    public void showProjectConfirmation(BaseAbilityBot bot, Long chatId, Project project) {
        String managerName = project.getManager() != null
                ? "@" + project.getManager().getUsername()
                : "None";

        String confirmation = String.format(
                "🧾 *Confirm Project Creation*%n%n*Name:* %s%n*Description:* %s%n*Manager:* %s%n%nType 'confirm' to create the project or 'cancel' to abort.",
                project.getProjectName(),
                project.getProjectDescription(),
                managerName
        );

        bot.silent().send(confirmation, chatId);
        userSessionManager.setState(project.getManager() != null
                        ? project.getManager().getId()
                        : 0L,
                UserState.PROJECT_CREATE_CONFIRMATION);
    }
}
