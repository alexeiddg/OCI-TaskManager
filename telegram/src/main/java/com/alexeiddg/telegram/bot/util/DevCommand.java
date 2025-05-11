package com.alexeiddg.telegram.bot.util;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempTaskDataStore;
import com.alexeiddg.telegram.service.AppUserService;

import enums.TaskStatus;

import model.Task;

import java.time.LocalDateTime;
@Component
public class DevCommand {

    private final UserSessionManager userSessionManager;
    private final AppUserService appUserService;
    private final TempTaskDataStore tempTaskDataStore;

    @Autowired
    public DevCommand(UserSessionManager userSessionManager, AppUserService appUserService, TempTaskDataStore tempTaskDataStore) {
        this.userSessionManager = userSessionManager;
        this.appUserService = appUserService;
        this.tempTaskDataStore = tempTaskDataStore;
    }

    public void handleDevCommand(BaseAbilityBot bot, String text, Long chatId, Long telegramId) {
        String[] parts = text.split(" ");
        if (parts.length < 2) {
            bot.silent().send("⚠️ Usage: /dev <STATE_NAME>", chatId);
            return;
        }

        String stateName = parts[1].toUpperCase();

        try {
            // Set the user state
            UserState state = UserState.valueOf(stateName);
            userSessionManager.setState(telegramId, state);

            // Optionally set dummy task data for task-related flows
            if (state.name().startsWith("TASK_CREATE")) {
                Task dummyTask = new Task();
                dummyTask.setCreatedBy(appUserService.getUserByTelegramId(String.valueOf(telegramId)).orElse(null));
                dummyTask.setIsActive(true);
                dummyTask.setStatus(TaskStatus.TODO);
                dummyTask.setCreatedAt(LocalDateTime.now());
                tempTaskDataStore.set(telegramId, dummyTask);
            }

            bot.silent().send("✅ Dev state set to `" + state + "`.\nContinue flow from here.", chatId);
        } catch (IllegalArgumentException e) {
            bot.silent().send("❌ Invalid state: `" + stateName + "`", chatId);
        }
    }
}
