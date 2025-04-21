package com.alexeiddg.telegram.bot.actions.task;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.DynamicReplyKeyboard;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempTaskDataStore;
import com.alexeiddg.telegram.service.AppUserService;
import com.alexeiddg.telegram.service.TaskLogService;
import com.alexeiddg.telegram.service.TaskService;
import enums.TaskStatus;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Task;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class TaskAbility {

    private final UserSessionManager userSessionManager;
    private final AppUserService appUserService;
    private final TaskService taskService;
    private final TaskLogService taskLogService;
    private final TempTaskDataStore tempTaskDataStore;

    public void viewTasks(BaseAbilityBot bot, Long chatId, Long telegramId) {
        userSessionManager.setState(telegramId, UserState.TASK);

        Optional<AppUser> userOpt = appUserService.getUserByTelegramId(String.valueOf(telegramId));

        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();
            List<Task> tasks = taskService.getTasksAssignedToUser(user.getId());

            // Filter only active tasks
            List<Task> activeTasks = tasks.stream()
                    .filter(task -> task.getStatus() != TaskStatus.DONE)
                    .toList();

            if (activeTasks.isEmpty()) {
                bot.silent().send("You have no active tasks right now.", chatId);
            } else {
                SendMessage message = new SendMessage();
                message.setChatId(String.valueOf(chatId));
                message.setText("Your active tasks:");

                List<String> taskOptions = activeTasks.stream()
                        .map(task -> String.format("%d %s [%s]", task.getId(), task.getTaskName(), task.getStatus()))
                        .toList();

                message.setReplyMarkup(DynamicReplyKeyboard.generateKeyboardForState(
                        UserState.TASK,
                        taskOptions
                ));

                try {
                    bot.execute(message);
                } catch (Exception e) {
                    e.printStackTrace();
                    bot.silent().send("⚠️ Failed to load tasks keyboard", chatId);
                }
            }

        } else {
            bot.silent().send("User not found", chatId);
        }
    }

    public void startTask(BaseAbilityBot  bot, Long chatId, Long telegramId) {
        userSessionManager.setState(telegramId, UserState.TASK_SELECT_START);
        bot.silent().send("Select a task to start by clicking the task", chatId);
    }

    public void handleStartTask(BaseAbilityBot bot, Update update) {
        Long chatId = update.getMessage().getChatId();
        String text = update.getMessage().getText();
        Long telegramId = update.getMessage().getFrom().getId();

        Pattern pattern = Pattern.compile("^(\\d+)\\s+");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            Long taskId = Long.parseLong(matcher.group(1));

            Optional<Task> taskOpt = taskService.getTaskById(taskId);
            if (taskOpt.isPresent()) {
                Task task = taskOpt.get();
                task.setStatus(TaskStatus.IN_PROGRESS);
                taskService.updateTask(task);

                userSessionManager.setState(telegramId, UserState.TASK);
                bot.silent().send("🚀 Task marked as in progress!", chatId);
                hotReloadKeyboard(bot, chatId, telegramId);
            } else {
                bot.silent().send("⚠️ Task not found. Please make sure the ID is correct.", chatId);
            }
        } else {
            bot.silent().send("⚠️ Invalid format. Please select a task from the menu or type in the format: `{ID} Task Name`", chatId);
        }
    }

    public void completeTask(BaseAbilityBot  bot, Long chatId, Long telegramId) {
        userSessionManager.setState(telegramId, UserState.TASK_SELECT_COMPLETE);
        bot.silent().send("Select a task to complete by clicking the task", chatId);
    }

    public void handleCompleteTask(BaseAbilityBot bot, Update update) {
        Long chatId = update.getMessage().getChatId();
        String text = update.getMessage().getText();
        Long telegramId = update.getMessage().getFrom().getId();

        Pattern pattern = Pattern.compile("^(\\d+)\\s+");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            Long taskId = Long.parseLong(matcher.group(1));
            Optional<Task> taskOpt = taskService.getTaskById(taskId);

            if (taskOpt.isPresent()) {
                Task task = taskOpt.get();
                tempTaskDataStore.set(telegramId, task);
                userSessionManager.setState(telegramId, UserState.TASK_LOG_HOURS);
                bot.silent().send("⏱️ Please enter the number of hours you spent on this task (e.g., 2.5):", chatId);
            } else {
                bot.silent().send("⚠️ Task not found. Make sure the ID is correct.", chatId);
            }
        } else {
            bot.silent().send("⚠️ Invalid format. Please select a task from the menu or type in the format: `{ID} Task Name`", chatId);
        }
    }

    public void handleLoggedHours(BaseAbilityBot bot, Update update) {
        Long chatId = update.getMessage().getChatId();
        Long telegramId = update.getMessage().getFrom().getId();
        String text = update.getMessage().getText();

        double hours;
        try {
            hours = Double.parseDouble(text);
            if (hours <= 0 || hours > 24) throw new IllegalArgumentException();
        } catch (Exception e) {
            bot.silent().send("⚠️ Invalid input. Please enter a number between 0.1 and 24.", chatId);
            return;
        }

        Task task = tempTaskDataStore.get(telegramId);
        Optional<AppUser> userOpt = appUserService.getUserByTelegramId(String.valueOf(telegramId));

        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();

            taskLogService.logHours(task, user, hours);
            taskService.markTaskAsCompleted(task.getId());

            bot.silent().send("✅ Task completed and hours logged successfully!", chatId);
            userSessionManager.setState(telegramId, UserState.TASK);
            tempTaskDataStore.clear(telegramId);
            hotReloadKeyboard(bot, chatId, telegramId);
        } else {
            bot.silent().send("⚠️ Could not find task or user. Try again.", chatId);
        }
    }

    public void reopenTask(BaseAbilityBot  bot, Long chatId, Long telegramId) {
        userSessionManager.setState(telegramId, UserState.TASK_SELECT_REOPEN);
        showInactiveTasksKeyboard(bot, chatId, telegramId);
    }

    public void handleReopenTask(BaseAbilityBot bot, Update update) {
        Long chatId = update.getMessage().getChatId();
        String text = update.getMessage().getText();
        Long telegramId = update.getMessage().getFrom().getId();

        Pattern pattern = Pattern.compile("^(\\d+)\\s+");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            Long taskId = Long.parseLong(matcher.group(1));

            Optional<Task> taskOpt = taskService.getTaskById(taskId);
            if (taskOpt.isPresent()) {
                Task task = taskOpt.get();
                task.setStatus(TaskStatus.IN_PROGRESS);
                task.setIsActive(true);
                task.setCompletedAt(null);

                taskService.updateTask(task);
                bot.silent().send("🔄 Task has been reopened and set to *in progress*.", chatId);
                userSessionManager.setState(telegramId, UserState.TASK);
                hotReloadKeyboard(bot, chatId, telegramId);
            } else {
                bot.silent().send("⚠️ Task not found. Please make sure the ID is correct.", chatId);
            }
        } else {
            bot.silent().send("⚠️ Invalid format. Please select a task from the menu or type in the format: `{ID} Task Name`", chatId);
        }
    }

    public void handleTaskDetails(BaseAbilityBot bot, Update update) {
        Long chatId = update.getMessage().getChatId();
        String text = update.getMessage().getText();

        Pattern pattern = Pattern.compile("^(\\d+)\\s+");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            Long taskId = Long.parseLong(matcher.group(1));
            Optional<Task> taskOpt = taskService.getTaskById(taskId);
            taskOpt.ifPresentOrElse(
                    task -> sendTaskDetails(bot, chatId, task),
                    () -> bot.silent().send("⚠️ Task not found.", chatId)
            );
        }
    }

    private void sendTaskDetails(BaseAbilityBot bot, Long chatId, Task task) {
        Optional<AppUser> userOpt = appUserService.getUserByTelegramId(String.valueOf(task.getAssignedTo().getTelegramId()));
        double hoursLogged = 0.0;

        if (userOpt.isPresent()) {
            AppUser assignedUser = userOpt.get();
            try {
                hoursLogged = taskLogService.getLoggedHours(task, assignedUser);
            } catch (Exception e) {
                hoursLogged = 0.0;
            }
        }

        StringBuilder sb = new StringBuilder();
        sb.append("📌 *Task Details*\n\n");
        sb.append("*Name:* ").append(task.getTaskName()).append("\n");
        sb.append("*Description:* ").append(task.getTaskDescription()).append("\n");
        sb.append("*Priority:* ").append(task.getPriority()).append("\n");
        sb.append("*Status:* ").append(task.getStatus()).append("\n");
        sb.append("*Type:* ").append(task.getType()).append("\n");
        sb.append("*Story Points (Estimated):* ").append(task.getStoryPoints()).append("\n");
        sb.append("*Hours Logged:* ").append(hoursLogged).append("\n");
        sb.append("*Blocked:* ").append(task.isBlocked() ? "Yes" : "No").append("\n");
        sb.append("*Due Date:* ").append(task.getDueDate() != null ? task.getDueDate().toLocalDate() : "N/A").append("\n");
        sb.append("*Created By:* ").append(task.getCreatedBy().getUsername()).append("\n");
        sb.append("*Assigned To:* ").append(
                task.getAssignedTo() != null ? task.getAssignedTo().getUsername() : "Not assigned"
        );

        SendMessage msg = new SendMessage();
        msg.setChatId(chatId.toString());
        msg.setText(sb.toString());

        try {
            bot.execute(msg);
        } catch (Exception e) {
            e.printStackTrace();
            bot.silent().send("⚠️ Failed to load task details", chatId);
        }
    }

    public void hotReloadKeyboard(BaseAbilityBot bot, Long chatId, Long telegramId) {
        Optional<AppUser> userOpt = appUserService.getUserByTelegramId(String.valueOf(telegramId));
        if (userOpt.isEmpty()) {
            bot.silent().send("⚠️ User not found for reload", chatId);
            return;
        }

        List<Task> updatedTasks = taskService.getTasksCreatedByUser(userOpt.get().getId()).stream()
                .filter(task -> Boolean.TRUE.equals(task.getIsActive()) && task.getStatus() != TaskStatus.DONE)
                .toList();

        List<String> updatedTaskOptions = updatedTasks.stream()
                .map(task -> String.format("%d %s [%s]", task.getId(), task.getTaskName(), task.getStatus()))
                .toList();

        SendMessage updatedKeyboardMsg = new SendMessage();
        updatedKeyboardMsg.setChatId(String.valueOf(chatId));
        updatedKeyboardMsg.setText("🔄 Updated list of active tasks:");
        updatedKeyboardMsg.setReplyMarkup(DynamicReplyKeyboard.generateKeyboardForState(
                UserState.TASK,
                updatedTaskOptions
        ));

        try {
            bot.execute(updatedKeyboardMsg);
        } catch (Exception e) {
            e.printStackTrace();
            bot.silent().send("⚠️ Failed to reload task list", chatId);
        }
    }

    public void showInactiveTasksKeyboard(BaseAbilityBot bot, Long chatId, Long telegramId) {
        Optional<AppUser> userOpt = appUserService.getUserByTelegramId(String.valueOf(telegramId));
        if (userOpt.isEmpty()) {
            bot.silent().send("⚠️ User not found for reload", chatId);
            return;
        }

        List<Task> inactiveTasks = taskService.getTasksAssignedToUser(userOpt.get().getId()).stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .toList();

        if (inactiveTasks.isEmpty()) {
            bot.silent().send("🎉 No completed tasks to reopen.", chatId);
            return;
        }

        List<String> taskOptions = inactiveTasks.stream()
                .map(task -> String.format("%d %s [%s]", task.getId(), task.getTaskName(), task.getStatus()))
                .toList();

        SendMessage msg = new SendMessage();
        msg.setChatId(String.valueOf(chatId));
        msg.setText("🗂️ Select a completed task to reopen:");
        msg.setReplyMarkup(DynamicReplyKeyboard.generateKeyboardForState(
                UserState.TASK,
                taskOptions
        ));

        try {
            bot.execute(msg);
        } catch (Exception e) {
            e.printStackTrace();
            bot.silent().send("⚠️ Failed to load completed tasks keyboard", chatId);
        }
    }
}
