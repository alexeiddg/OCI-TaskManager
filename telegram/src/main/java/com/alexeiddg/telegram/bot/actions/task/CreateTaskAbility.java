package com.alexeiddg.telegram.bot.actions.task;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.DynamicReplyKeyboard;
import com.alexeiddg.telegram.bot.util.ReplyKeyboard;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempTaskDataStore;
import com.alexeiddg.telegram.service.AppUserService;
import com.alexeiddg.telegram.service.SprintService;
import com.alexeiddg.telegram.service.TaskService;
import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Sprint;
import model.Task;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class CreateTaskAbility {

    private final UserSessionManager userSessionManager;
    private final AppUserService appUserService;
    private final TempTaskDataStore tempTaskDataStore;
    private final SprintService sprintService;
    private final TaskService taskService;

    public void createTask(BaseAbilityBot bot, Long chatId, Long telegramId) {
        Optional<AppUser> userOpt = appUserService.getUserByTelegramId(String.valueOf(telegramId));
        assert userOpt.isPresent() : "User not found in the database";

        Task task = new Task();
        task.setBlocked(false);
        task.setCreatedBy(userOpt.get());
        task.setIsActive(true);
        task.setStatus(TaskStatus.TODO);
        task.setCreatedAt(LocalDateTime.now());
        tempTaskDataStore.set(telegramId, task);

        userSessionManager.setState(telegramId, UserState.TASK_CREATE_NAME);
        bot.silent().send("Please enter the task name:", chatId);
    }

    public void handleCreateTask(BaseAbilityBot bot, Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String text = update.getMessage().getText();
            Long telegramId = update.getMessage().getFrom().getId();
            Long chatId = update.getMessage().getChatId();

            UserState state = userSessionManager.getState(telegramId);

            switch (state) {
                case TASK_CREATE_NAME -> {
                    Task task = tempTaskDataStore.get(telegramId);
                    task.setTaskName(text);
                    tempTaskDataStore.set(telegramId, task);

                    userSessionManager.setState(telegramId, UserState.TASK_CREATE_DESCRIPTION);
                    bot.silent().send("Please enter the task description:", chatId);
                }

                case TASK_CREATE_DESCRIPTION -> {
                    Task task = tempTaskDataStore.get(telegramId);
                    task.setTaskDescription(text);
                    tempTaskDataStore.set(telegramId, task);

                    userSessionManager.setState(telegramId, UserState.TASK_CREATE_PRIORITY);
                    SendMessage msg = new SendMessage();
                    msg.setChatId(chatId.toString());
                    msg.setText("Please select the task priority (LOW, MEDIUM, HIGH) from the menu:");
                    msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.TASK_CREATE_PRIORITY));

                    try {
                        bot.execute(msg);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                case TASK_CREATE_PRIORITY -> {
                    Task task = tempTaskDataStore.get(telegramId);

                    if (text.equalsIgnoreCase("low")) {
                        task.setPriority(TaskPriority.LOW);
                        tempTaskDataStore.set(telegramId, task);
                    } else if (text.equalsIgnoreCase("medium")) {
                        task.setPriority(TaskPriority.MEDIUM);
                        tempTaskDataStore.set(telegramId, task);
                    } else if (text.equalsIgnoreCase("high")) {
                        task.setPriority(TaskPriority.HIGH);
                        tempTaskDataStore.set(telegramId, task);
                    } else {
                        bot.silent().send("⚠️ Invalid priority. Please select from the menu.", chatId);
                    }

                    userSessionManager.setState(telegramId, UserState.TASK_CREATE_TYPE);
                    SendMessage msg = new SendMessage();
                    msg.setChatId(chatId.toString());
                    msg.setText("Please select the task type (FEATURE, BUG, IMPROVEMENT) from the menu:");
                    msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.TASK_CREATE_TYPE));

                    try {
                        bot.execute(msg);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                case TASK_CREATE_TYPE -> {
                    Task task = tempTaskDataStore.get(telegramId);

                    if (text.equalsIgnoreCase("feature")) {
                        task.setType(TaskType.FEATURE);
                        tempTaskDataStore.set(telegramId, task);
                    } else if (text.equalsIgnoreCase("bug")) {
                        task.setType(TaskType.BUG);
                        tempTaskDataStore.set(telegramId, task);
                    } else if (text.equalsIgnoreCase("improvement")) {
                        task.setType(TaskType.IMPROVEMENT);
                        tempTaskDataStore.set(telegramId, task);
                    } else {
                        bot.silent().send("⚠️ Invalid type. Please select from the menu.", chatId);
                    }

                    userSessionManager.setState(telegramId, UserState.TASK_CREATE_STORY_POINTS);
                    SendMessage msg = new SendMessage();
                    msg.setChatId(chatId.toString());
                    msg.setText("Please enter the estimated time for the task from the menu, maximum 4 hours:");
                    msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.TASK_CREATE_STORY_POINTS));

                    try {
                        bot.execute(msg);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                case TASK_CREATE_STORY_POINTS -> {
                    Task task = tempTaskDataStore.get(telegramId);
                    int storyPoints;

                    try {
                        storyPoints = Integer.parseInt(text);
                    } catch (NumberFormatException e) {
                        bot.silent().send("⚠️ Invalid input. Please enter a number.", chatId);
                        return;
                    }

                    if (storyPoints < 0 || storyPoints > 4) {
                        bot.silent().send("⚠️ Invalid input. Please enter a number between 0 and 4.", chatId);
                        return;
                    }

                    task.setStoryPoints(storyPoints);
                    tempTaskDataStore.set(telegramId, task);

                    userSessionManager.setState(telegramId, UserState.TASK_CREATE_DUE_DATE);
                    bot.silent().send("Please enter the due date for the task (YYYY-MM-DD):", chatId);
                }

                case TASK_CREATE_DUE_DATE -> {
                    Task task = tempTaskDataStore.get(telegramId);
                    if (task == null) {
                        bot.silent().send("⚠️ Something went wrong. Try 'Create Task' again.", chatId);
                        userSessionManager.clearState(telegramId);
                        return;
                    }

                    Pattern datePattern = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");
                    Matcher dateMatcher = datePattern.matcher(text);

                    if (dateMatcher.find()) {
                        String dueDate = dateMatcher.group();
                        try {
                            task.setDueDate(LocalDate.parse(dueDate).atStartOfDay());
                            tempTaskDataStore.set(telegramId, task);

                            Optional<AppUser> userOpt = appUserService.getUserByTelegramId(String.valueOf(telegramId));
                            if (userOpt.isPresent() && userOpt.get().getRole() == UserRole.MANAGER) {
                                userSessionManager.setState(telegramId, UserState.TASK_CREATE_ASSIGNEE);

                                List<AppUser> developers = appUserService.getAllUsersByRole(UserRole.DEVELOPER);
                                List<String> developerUsernames = developers.stream()
                                        .map(AppUser::getUsername)
                                        .toList();

                                SendMessage msg = new SendMessage();
                                msg.setChatId(chatId.toString());
                                msg.setText("Please select the assignee from the menu or enter 'Assign to self':");
                                msg.setReplyMarkup(DynamicReplyKeyboard.generateKeyboardForState(
                                        UserState.TASK_CREATE_ASSIGNEE, developerUsernames));

                                try {
                                    bot.execute(msg);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }

                            } else {
                                task.setAssignedTo(task.getCreatedBy());
                                tempTaskDataStore.set(telegramId, task);
                                userSessionManager.setState(telegramId, UserState.TASK_CREATE_SPRINT);

                                bot.silent().send("✅ Assigned to yourself.\nNow select a sprint to assign this task to:", chatId);
                                List<Sprint> sprints = sprintService.getSprintsForUser(userOpt.get().getId());
                                List<String> sprintOptions = sprints.stream()
                                        .map(sprint -> String.format("%s (ID: %d)", sprint.getSprintName(), sprint.getId()))
                                        .toList();

                                SendMessage msg = new SendMessage();
                                msg.setChatId(chatId.toString());
                                msg.setText("Please select a sprint to attach the task to from the menu:");
                                msg.setReplyMarkup(DynamicReplyKeyboard.generateKeyboardForState(
                                        UserState.TASK_CREATE_SPRINT, sprintOptions));

                                try {
                                    bot.execute(msg);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }

                        } catch (Exception e) {
                            bot.silent().send("⚠️ Failed to parse the date. Please use format YYYY-MM-DD.", chatId);
                        }
                    } else {
                        bot.silent().send("⚠️ Invalid date format. Please enter the date in YYYY-MM-DD format.", chatId);
                    }
                }

                case TASK_CREATE_ASSIGNEE -> {
                    Task task = tempTaskDataStore.get(telegramId);

                    if (text.equalsIgnoreCase("Assign to self")) {
                        task.setAssignedTo(task.getCreatedBy());
                    } else {
                        Optional<AppUser> assigneeOpt = appUserService.getUserByUsername(text);

                        if (assigneeOpt.isEmpty()) {
                            bot.silent().send("⚠️ User not found. Please select a valid user from the menu.", chatId);
                            return;
                        }

                        task.setAssignedTo(assigneeOpt.get());
                    }
                    tempTaskDataStore.set(telegramId, task);
                    userSessionManager.setState(telegramId, UserState.TASK_CREATE_SPRINT);

                    Optional<AppUser> userOpt = appUserService.getUserByTelegramId(String.valueOf(telegramId));
                    List<Sprint> sprints = sprintService.getSprintsForUser(userOpt.get().getId());
                    List<String> sprintOptions = sprints.stream()
                            .map(sprint -> String.format("%s (ID: %d)", sprint.getSprintName(), sprint.getId()))
                            .toList();

                    SendMessage msg = new SendMessage();
                    msg.setChatId(chatId.toString());
                    msg.setText("Please select a sprint to attach the task to from the menu:");
                    msg.setReplyMarkup(DynamicReplyKeyboard.generateKeyboardForState(
                            UserState.TASK_CREATE_SPRINT, sprintOptions));

                    try {
                        bot.execute(msg);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                case TASK_CREATE_SPRINT -> {
                    Task task = tempTaskDataStore.get(telegramId);
                    if (task == null) {
                        bot.silent().send("⚠️ Something went wrong. Try 'Create Task' again.", chatId);
                        userSessionManager.clearState(telegramId);
                        return;
                    }

                    Pattern sprintPattern = Pattern.compile("^(.*?)\\s*\\(.*?\\)\\s*\\(ID:\\s*(\\d+)\\)$");
                    Matcher matcher = sprintPattern.matcher(text);

                    if (matcher.find()) {
                        Long sprintId = Long.parseLong(matcher.group(2));
                        Optional<Sprint> sprintOpt = sprintService.getSprintById(sprintId);

                        if (sprintOpt.isPresent()) {
                            task.setSprint(sprintOpt.get());
                            tempTaskDataStore.set(telegramId, task);

                            userSessionManager.setState(telegramId, UserState.TASK_CREATE_CONFIRMATION);
                            bot.silent().send("✅ Sprint selected. Type `confirm` to save the task or `cancel` to discard.", chatId);

                            // Optionally show a task summary here
                            String summary = String.format("""
                            📝 *Task Summary*
                            Name: %s
                            Description: %s
                            Priority: %s
                            Type: %s
                            Story Points: %d
                            Due Date: %s
                            Assignee: %s
                            Sprint: %s
                            """,
                                    task.getTaskName(),
                                    task.getTaskDescription(),
                                    task.getPriority(),
                                    task.getType(),
                                    task.getStoryPoints(),
                                    task.getDueDate().toLocalDate(),
                                    task.getAssignedTo().getUsername(),
                                    sprintOpt.get().getSprintName()
                            );
                            bot.silent().send(summary, chatId);

                        } else {
                            bot.silent().send("⚠️ Sprint not found. Please select a valid sprint.", chatId);
                        }

                    } else {
                        bot.silent().send("⚠️ Invalid sprint format. Please select from the menu.", chatId);
                    }
                }

                case TASK_CREATE_CONFIRMATION -> {
                    Task task = tempTaskDataStore.get(telegramId);

                    if (task == null) {
                        bot.silent().send("⚠️ Something went wrong. Please restart task creation.", chatId);
                        userSessionManager.clearState(telegramId);
                        return;
                    }

                    if (text.equalsIgnoreCase("confirm")) {
                        taskService.createTask(task);

                        bot.silent().send("✅ Task created successfully!", chatId);

                        userSessionManager.setState(telegramId, UserState.MAIN_MENU);
                        tempTaskDataStore.clear(telegramId);

                        SendMessage msg = new SendMessage();
                        msg.setChatId(chatId.toString());
                        msg.setText("Main Menu");
                        msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.MAIN_MENU));

                        try {
                            bot.execute(msg);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                    } else if (text.equalsIgnoreCase("cancel")) {
                        bot.silent().send("❌ Task creation cancelled.", chatId);

                        userSessionManager.clearState(telegramId);
                        tempTaskDataStore.clear(telegramId);

                    } else {
                        bot.silent().send("⚠️ Please type 'confirm' to save the task or 'cancel' to discard it.", chatId);
                    }
                }
            }
        }
    }
}

