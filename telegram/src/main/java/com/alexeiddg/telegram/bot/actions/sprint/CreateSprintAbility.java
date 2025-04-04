package com.alexeiddg.telegram.bot.actions.sprint;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.DynamicReplyKeyboard;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempSprintDataStore;
import com.alexeiddg.telegram.service.AppUserService;
import com.alexeiddg.telegram.service.ProjectService;
import com.alexeiddg.telegram.service.SprintService;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Project;
import model.Sprint;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.time.LocalDate;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class CreateSprintAbility {

    private final ProjectService projectService;
    private final SprintService sprintService;
    private final AppUserService appUserService;
    private final UserSessionManager userSessionManager;
    private final TempSprintDataStore tempSprintDataStore;

    public void createSprint(BaseAbilityBot bot, Long chatId, Long telegramUserId) {
        AppUser user = appUserService.getUserByTelegramId(telegramUserId.toString()).orElse(null);
        userSessionManager.setState(telegramUserId, UserState.SPRINT_CREATE_PROJECT_SELECT);

        if (user == null) {
            bot.silent().send("❌ User not found. Please login first.", chatId);
        }

        if (user.getRole().equals(UserRole.MANAGER)) {
            bot.silent().send("Select A project from the menu to create a new sprint!.", chatId);
        } else {
            bot.silent().send("Please Ask your manager to create a new sprint for a project!.", chatId);
        }

        List<Project> projects = projectService.getProjectsByManagerId(user.getId());

        if (projects.isEmpty()) {
            bot.silent().send("No projects found for you.\nYou can create one with '➕ Create Project'", chatId);
            return;
        }

        List<String> projectOptions = projects.stream()
                .map(project -> String.format("%s (ID: %d)", project.getProjectName(), project.getId()))
                .toList();

        var keyboard = DynamicReplyKeyboard.generateKeyboardForState(UserState.SPRINT_CREATE_PROJECT_SELECT, projectOptions);
        SendMessage msg = new SendMessage();
        msg.setChatId(chatId.toString());
        msg.setText("Select a project to create a new sprint:");
        msg.setReplyMarkup(keyboard);

        try {
            bot.execute(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void handleCreateSprint(BaseAbilityBot bot, Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) return;

        String text = update.getMessage().getText();
        Long chatId = update.getMessage().getChatId();
        Long telegramUserId = update.getMessage().getFrom().getId();
        UserState state = userSessionManager.getState(telegramUserId);

        AppUser user = appUserService.getUserByTelegramId(telegramUserId.toString()).orElse(null);

        if (user == null) {
            bot.silent().send("❌ User not found. Please login first.", chatId);
        }

        switch (state) {
            case SPRINT_CREATE_PROJECT_SELECT -> {
                Pattern pattern = Pattern.compile("^(.*?)\\s*\\(ID:\\s*(\\d+)\\)$");
                Matcher matcher = pattern.matcher(text);

                if (matcher.find()) {
                    Long projectId = Long.parseLong(matcher.group(2));
                    Project selectedProject = projectService.getProjectById(projectId);

                    if (selectedProject == null) {
                        bot.silent().send("❌ Project not found. Try again.", chatId);
                        return;
                    }

                    Sprint sprint = new Sprint();
                    sprint.setProject(selectedProject);
                    sprint.setActive(true);
                    sprint.setCompletedTasks(0);
                    sprint.setTotalTasks(0);
                    sprint.setCompletionRate(0.0f);

                    tempSprintDataStore.set(telegramUserId, sprint);
                    userSessionManager.setState(telegramUserId, UserState.SPRINT_CREATE_NAME);
                    bot.silent().send("📝 Great! Now enter the name of your new sprint:", chatId);
                } else {
                    bot.silent().send("⚠️ Invalid project format. Please select a project from the menu.", chatId);
                }
            }

            case SPRINT_CREATE_NAME -> {
                Sprint sprint = tempSprintDataStore.get(telegramUserId);
                if (sprint == null) {
                    bot.silent().send("⚠️ Something went wrong. Try 'Create Sprint' again.", chatId);
                    userSessionManager.clearState(telegramUserId);
                    return;
                }

                sprint.setSprintName(text);
                userSessionManager.setState(telegramUserId, UserState.SPRINT_CREATE_START_DATE);
                bot.silent().send("📅 Got it. Now enter the *start date* (YYYY-MM-DD):", chatId);
            }

            case SPRINT_CREATE_START_DATE -> {
                Sprint sprint = tempSprintDataStore.get(telegramUserId);
                if (sprint == null) {
                    bot.silent().send("⚠️ Something went wrong. Try 'Create Sprint' again.", chatId);
                    userSessionManager.clearState(telegramUserId);
                    return;
                }

                Pattern datePattern = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");
                Matcher dateMatcher = datePattern.matcher(text);

                if (dateMatcher.find()) {
                    String startDate = dateMatcher.group();
                    sprint.setStartDate(LocalDate.parse(startDate).atStartOfDay());
                    userSessionManager.setState(telegramUserId, UserState.SPRINT_CREATE_END_DATE);
                    bot.silent().send("📅 Got it. Now enter the *end date* (YYYY-MM-DD):", chatId);
                } else {
                    bot.silent().send("⚠️ Invalid date format. Please enter the date in YYYY-MM-DD format.", chatId);
                }
            }

            case SPRINT_CREATE_END_DATE -> {
                Sprint sprint = tempSprintDataStore.get(telegramUserId);
                if (sprint == null) {
                    bot.silent().send("⚠️ Something went wrong. Try 'Create Sprint' again.", chatId);
                    userSessionManager.clearState(telegramUserId);
                    return;
                }

                Pattern datePattern = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");
                Matcher dateMatcher = datePattern.matcher(text);

                if (dateMatcher.find()) {
                    String endDate = dateMatcher.group();
                    sprint.setEndDate(LocalDate.parse(endDate).atStartOfDay());
                    userSessionManager.setState(telegramUserId, UserState.SPRINT_CREATE_CONFIRMATION);
                    bot.silent().send("Type 'confirm' to confirm the sprint creation or 'cancel' to cancel.", chatId);
                    bot.silent().send("📅 Please confirm the details:\n" +
                            "Name: " + sprint.getSprintName() + "\n" +
                            "Start Date: " + sprint.getStartDate() + "\n" +
                            "End Date: " + sprint.getEndDate(), chatId);
                } else {
                    bot.silent().send("⚠️ Invalid date format. Please enter the date in YYYY-MM-DD format.", chatId);
                }
            }

            case SPRINT_CREATE_CONFIRMATION -> {
                Sprint sprint = tempSprintDataStore.get(telegramUserId);
                if (sprint == null) {
                    bot.silent().send("⚠️ Something went wrong. Try 'Create Sprint' again.", chatId);
                    userSessionManager.clearState(telegramUserId);
                    return;
                }

                if (text.equalsIgnoreCase("confirm")) {
                    sprintService.createSprint(sprint);
                    bot.silent().send("✅ Sprint created successfully!", chatId);
                    userSessionManager.clearState(telegramUserId);
                    tempSprintDataStore.clear(telegramUserId);
                } else {
                    bot.silent().send("❌ Sprint creation cancelled.", chatId);
                    userSessionManager.clearState(telegramUserId);
                    tempSprintDataStore.clear(telegramUserId);
                }
            }
        }
    }
}
