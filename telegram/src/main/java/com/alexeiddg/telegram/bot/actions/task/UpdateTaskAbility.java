package com.alexeiddg.telegram.bot.actions.task;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.ReplyKeyboard;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempTaskDataStore;
import com.alexeiddg.telegram.service.AppUserService;
import com.alexeiddg.telegram.service.TaskLogService;
import com.alexeiddg.telegram.service.TaskService;
import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Task;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.User;

import java.time.LocalDate;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class UpdateTaskAbility {

    private final UserSessionManager userSessionManager;
    private final TaskService taskService;
    private final TaskLogService taskLogService;
    private final TempTaskDataStore tempTaskDataStore;
    private final AppUserService appUserService;

    public void updateTask(BaseAbilityBot bot, Long chatId, Long telegramId) {
        bot.silent().send("📝 Please select a task to update from the menu or type in the format: `{ID} Task Name`", chatId);
        userSessionManager.setState(telegramId, UserState.TASK_UPDATE_SELECT);
    }

    public void handleUpdateTask(BaseAbilityBot bot, Update update) {
        Long chatId = update.getMessage().getChatId();
        String text = update.getMessage().getText();
        Long telegramId = update.getMessage().getFrom().getId();

        UserState state = userSessionManager.getState(telegramId);
        Task task = tempTaskDataStore.get(telegramId);

        // Task selection flow
        if (state == UserState.TASK_UPDATE_SELECT && text.matches("^\\d+\\s+.*")) {
            Long taskId = Long.parseLong(text.split("\\s+")[0]);
            Optional<Task> taskOpt = taskService.getTaskById(taskId);
            if (taskOpt.isPresent()) {
                tempTaskDataStore.set(telegramId, taskOpt.get());
                userSessionManager.setState(telegramId, UserState.TASK_UPDATE);
                SendMessage msg = new SendMessage();
                msg.setChatId(chatId.toString());
                msg.setText("✅ Task selected.\nChoose what to update:");
                msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.TASK_UPDATE));
                execute(bot, msg);
            } else {
                bot.silent().send("⚠️ Task not found.", chatId);
            }
            return;
        }

        if ("🏠 Main Menu".equals(text)) {
            userSessionManager.setState(telegramId, UserState.MAIN_MENU);
            return;
        }

        if (state == UserState.TASK_UPDATE || state == UserState.TASK_UPDATE_SELECT) {
            switch (text) {
                case "🔤 Update Name" -> {
                    userSessionManager.setState(telegramId, UserState.TASK_UPDATE_NAME);
                    bot.silent().send("Please enter the new task name:", chatId);
                    return;
                }
                case "🗒️ Update Description" -> {
                    userSessionManager.setState(telegramId, UserState.TASK_UPDATE_DESCRIPTION);
                    bot.silent().send("Please enter the new task description:", chatId);
                    return;
                }
                case "⚡ Change Priority" -> {
                    userSessionManager.setState(telegramId, UserState.TASK_UPDATE_PRIORITY);
                    sendSimpleKeyboard(bot, chatId, "Select new priority:", UserState.TASK_CREATE_PRIORITY);
                    return;
                }
                case "📊 Change Status" -> {
                    userSessionManager.setState(telegramId, UserState.TASK_UPDATE_STATUS);
                    sendSimpleKeyboard(bot, chatId, "Select new status:", UserState.TASK_UPDATE_STATUS);
                    return;
                }
                case "🛠️ Change Type" -> {
                    userSessionManager.setState(telegramId, UserState.TASK_UPDATE_TYPE);
                    sendSimpleKeyboard(bot, chatId, "Select new type:", UserState.TASK_CREATE_TYPE);
                    return;
                }
                case "📏 Change Story Points" -> {
                    userSessionManager.setState(telegramId, UserState.TASK_UPDATE_STORY_POINTS);
                    bot.silent().send("Enter new story points (0–4):", chatId);
                    return;
                }
                case "📅 Change Due Date" -> {
                    userSessionManager.setState(telegramId, UserState.TASK_UPDATE_DUE_DATE);
                    bot.silent().send("Enter new due date (YYYY-MM-DD):", chatId);
                    return;
                }
                case "🚧 Toggle Blocked" -> {
                    userSessionManager.setState(telegramId, UserState.TASK_UPDATE_BLOCKED);
                    if (task != null) {
                        task.setBlocked(!task.isBlocked());
                        confirmAndReturn(bot, chatId, telegramId, task, "Blocked status toggled.");
                    } else {
                        bot.silent().send("⚠️ No task selected. Please select again.", chatId);
                        userSessionManager.setState(telegramId, UserState.TASK_UPDATE_SELECT);
                    }
                    return;
                }
                case "⏱️ Log Hours" -> {
                    userSessionManager.setState(telegramId, UserState.TASK_UPDATE_LOG_HOURS);
                    bot.silent().send("How many hours did you work on this task? (0.1–24)", chatId);
                    return;
                }
                default -> {
                    bot.silent().send("⚠️ Invalid action. Please choose from the update menu.", chatId);
                    return;
                }
            }
        }

        if (task == null) {
            bot.silent().send("⚠️ No task selected. Please select again.", chatId);
            userSessionManager.setState(telegramId, UserState.TASK_UPDATE_SELECT);
            return;
        }

        switch (state) {
            case TASK_UPDATE_NAME -> {
                task.setTaskName(text);
                confirmAndReturn(bot, chatId, telegramId, task, "Name updated.");
            }
            case TASK_UPDATE_DESCRIPTION -> {
                task.setTaskDescription(text);
                confirmAndReturn(bot, chatId, telegramId, task, "Description updated.");
            }
            case TASK_UPDATE_PRIORITY -> {
                switch (text.toLowerCase()) {
                    case "low" -> task.setPriority(TaskPriority.LOW);
                    case "medium" -> task.setPriority(TaskPriority.MEDIUM);
                    case "high" -> task.setPriority(TaskPriority.HIGH);
                    default -> {
                        bot.silent().send("⚠️ Invalid priority. Choose Low, Medium, or High.", chatId);
                        return;
                    }
                }
                confirmAndReturn(bot, chatId, telegramId, task, "Priority updated.");
            }
            case TASK_UPDATE_STATUS -> {
                try {
                    TaskStatus status = TaskStatus.valueOf(text.toUpperCase());
                    task.setStatus(status);
                    confirmAndReturn(bot, chatId, telegramId, task, "Status updated.");
                } catch (IllegalArgumentException e) {
                    bot.silent().send("⚠️ Invalid status. Choose TODO, IN_PROGRESS, or DONE.", chatId);
                }
            }
            case TASK_UPDATE_TYPE -> {
                try {
                    TaskType type = TaskType.valueOf(text.toUpperCase());
                    task.setType(type);
                    confirmAndReturn(bot, chatId, telegramId, task, "Type updated.");
                } catch (IllegalArgumentException e) {
                    bot.silent().send("⚠️ Invalid type. Choose BUG, FEATURE, or IMPROVEMENT.", chatId);
                }
            }
            case TASK_UPDATE_STORY_POINTS -> {
                try {
                    int points = Integer.parseInt(text);
                    if (points < 0 || points > 8) throw new NumberFormatException();
                    task.setStoryPoints(points);
                    confirmAndReturn(bot, chatId, telegramId, task, "Story points updated.");
                } catch (NumberFormatException e) {
                    bot.silent().send("⚠️ Enter a valid number (0–8).", chatId);
                }
            }
            case TASK_UPDATE_DUE_DATE -> {
                try {
                    task.setDueDate(LocalDate.parse(text).atStartOfDay());
                    confirmAndReturn(bot, chatId, telegramId, task, "Due date updated.");
                } catch (Exception e) {
                    bot.silent().send("⚠️ Use format YYYY-MM-DD.", chatId);
                }
            }
            case TASK_UPDATE_BLOCKED -> {
                task.setBlocked(!task.isBlocked());
                confirmAndReturn(bot, chatId, telegramId, task, "Blocked status toggled.");
            }
            case TASK_UPDATE_LOG_HOURS -> {
                try {
                    double hours = Double.parseDouble(text);
                    if (hours <= 0 || hours > 24) throw new IllegalArgumentException();
                    Optional<AppUser> userOpt = appUserService.getUserByTelegramId(String.valueOf(telegramId));
                    if (userOpt.isPresent()) {
                        taskLogService.logHours(task, userOpt.get(), hours);
                        bot.silent().send("⏱️ Hours logged!", chatId);
                    } else {
                        bot.silent().send("⚠️ Could not find user.", chatId);
                    }
                    returnToUpdateMenu(bot, chatId, telegramId);
                } catch (Exception e) {
                    bot.silent().send("⚠️ Enter a number between 0.1 and 24.", chatId);
                }
            }
            default -> bot.silent().send("⚠️ Invalid action. Please choose an option from the menu.", chatId);
        }
    }

    private void confirmAndReturn(BaseAbilityBot bot, Long chatId, Long telegramId, Task task, String msgText) {
        taskService.updateTask(task);
        bot.silent().send("✅ " + msgText, chatId);
        returnToUpdateMenu(bot, chatId, telegramId);
    }

    private void returnToUpdateMenu(BaseAbilityBot bot, Long chatId, Long telegramId) {
        userSessionManager.setState(telegramId, UserState.TASK_UPDATE_SELECT);
        SendMessage msg = new SendMessage();
        msg.setChatId(chatId.toString());
        msg.setText("What else would you like to update?");
        msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.TASK_UPDATE_SELECT));
        execute(bot, msg);
    }

    private void execute(BaseAbilityBot bot, SendMessage msg) {
        try {
            bot.execute(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendSimpleKeyboard(BaseAbilityBot bot, Long chatId, String prompt, UserState keyboardState) {
        SendMessage msg = new SendMessage();
        msg.setChatId(chatId.toString());
        msg.setText(prompt);
        msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(keyboardState));
        try {
            bot.execute(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}