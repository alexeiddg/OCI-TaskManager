package com.alexeiddg.telegram.bot.actions.project;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempProjectDataStore;
import com.alexeiddg.telegram.service.ProjectService;
import lombok.RequiredArgsConstructor;
import model.Project;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class DeleteProjectAbility {

    // TODO: Refresh keyboard after deletion

    private final UserSessionManager userSessionManager;
    private final TempProjectDataStore tempProjectDataStore;
    private final ProjectService projectService;

    public void selectProjectDelete(BaseAbilityBot bot, Long chatId, Long telegramUserId) {
        userSessionManager.setState(telegramUserId, UserState.PROJECT_DELETE);
        bot.silent().send("🗑️ Select a project to delete by selecting it from the menu", chatId);
    }

    public void deleteProject(BaseAbilityBot bot, Update update) {
        Long chatId = update.getMessage().getChatId();
        Long telegramUserId = update.getMessage().getFrom().getId();
        UserState state = userSessionManager.getState(telegramUserId);

        if (state.equals(UserState.PROJECT_DELETE)) {
            if (!update.hasMessage() || !update.getMessage().hasText()) return;

            String text = update.getMessage().getText();

            // regex to extract the project ID from text "{ProjectName} (ID: {projectId})"
            Pattern pattern = Pattern.compile("^(.*?)\\s*\\(ID:\\s*(\\d+)\\)$");
            Matcher matcher = pattern.matcher(text);
            if (matcher.find()) {
                String projectName = matcher.group(1);
                Long projectId = Long.parseLong(matcher.group(2));

                Project projectOpt = projectService.getProjectById(projectId);

                if (Boolean.TRUE.equals(projectOpt.getIsActive())) {
                    tempProjectDataStore.set(telegramUserId, projectOpt);
                    userSessionManager.setState(telegramUserId, UserState.PROJECT_DELETE_CONFIRM);

                    bot.silent().send(
                            "Project " + projectName + " is active. " +
                                    "Please confirm deletion by typing 'delete' or cancel by typing 'cancel'.",
                            chatId
                    );

                } else {
                    projectService.deleteProject(projectId);
                    bot.silent().send("Project " + projectName + " deleted successfully.", chatId);
                    userSessionManager.setState(telegramUserId, UserState.MAIN_MENU);
                }
            }
        }
    }

    public void confirmDelete(BaseAbilityBot bot, Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) return;

        if (update.getMessage().getText().equalsIgnoreCase("delete")) {
            Long telegramUserId = update.getMessage().getFrom().getId();
            Project project = tempProjectDataStore.get(telegramUserId);
            if (project != null) {
                projectService.deleteProject(project.getId());
                bot.silent().send("Project " + project.getProjectName() + " deleted successfully.", update.getMessage().getChatId());
                userSessionManager.setState(telegramUserId, UserState.MAIN_MENU);
            } else {
                bot.silent().send("⚠️ No project selected for deletion.", update.getMessage().getChatId());
            }
        } else {
            bot.silent().send("❌ Deletion cancelled.", update.getMessage().getChatId());
        }
    }
}
