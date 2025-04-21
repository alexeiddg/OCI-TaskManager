package com.alexeiddg.telegram.bot.actions.task;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.service.TaskService;
import enums.TaskStatus;
import lombok.RequiredArgsConstructor;
import model.Task;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class DeleteTaskAbility {

    private final UserSessionManager userSessionManager;
    private final TaskService taskService;
    private final TaskAbility taskAbility;

    public void deleteTask(BaseAbilityBot bot, Long chatId, Long telegramId) {
        bot.silent().send("🗑️ Please select a task to delete from the menu or type in the format: `{ID} Task Name`", chatId);
        userSessionManager.setState(telegramId, UserState.TASK_DELETE);
    }

    public void handleDeleteTask(BaseAbilityBot bot, Update update) {
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
                task.setIsActive(false);

                taskService.updateTask(task);
                bot.silent().send("🔄 Task has been deleted", chatId);
                userSessionManager.setState(telegramId, UserState.TASK);
                taskAbility.hotReloadKeyboard(bot, chatId, telegramId);
            } else {
                bot.silent().send("⚠️ Task not found. Please make sure the ID is correct.", chatId);
            }
        } else {
            bot.silent().send("⚠️ Invalid format. Please select a task from the menu or type in the format: `{ID} Task Name`", chatId);
        }
    }
}
