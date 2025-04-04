package com.alexeiddg.telegram.bot.actions.project;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.DynamicReplyKeyboard;
import com.alexeiddg.telegram.service.AppUserService;
import com.alexeiddg.telegram.service.ProjectService;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Project;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProjectAbility {

    private final UserSessionManager userSessionManager;
    private final AppUserService appUserService;
    private final ProjectService projectService;
    private final CreateProjectAbility createProjectAbility;
    private final DeleteProjectAbility deleteProjectAbility;

    public void ViewProjects(BaseAbilityBot bot, Long chatId, Long telegramUserId) {
        userSessionManager.setState(telegramUserId, UserState.PROJECT);
        AppUser user = appUserService.getUserByTelegramId(telegramUserId.toString()).orElse(null);

        if (user == null) {
            bot.silent().send("User not found.", chatId);
        }

        List<Project> projects;
        assert user != null;

        if (user.getRole() == UserRole.MANAGER) {
            projects = projectService.getProjectsByManagerId(user.getId());
        } else {
            projects = projectService.getProjectsByDeveloperId(user.getId());
        }

        if (projects.isEmpty()) {
            bot.silent().send(
                    "No projects found for you.\n" +
                            "You can create a new project with '➕ Create Project'",
                    chatId
            );
        }

        List<String> projectOptions = projects.stream()
                .map(project -> String.format("%s (ID: %d)", project.getProjectName(), project.getId()))
                .toList();

        var keyboard = DynamicReplyKeyboard.generateKeyboardForState(UserState.PROJECT, projectOptions);
        SendMessage msg = new SendMessage();
        msg.setChatId(chatId.toString());
        msg.setText(
                "Click on a project to see its details or choose an action below."
        );
        msg.setReplyMarkup(keyboard);

        try {
            bot.execute(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void createProject(BaseAbilityBot bot, Long chatId, Long telegramUserId) {
        createProjectAbility.startProjectCreation(bot, chatId, telegramUserId);
    }

    public void deleteProject(BaseAbilityBot bot, Long chatId, Long projectId) {
        deleteProjectAbility.selectProjectDelete(bot, chatId, projectId);
    }

}
