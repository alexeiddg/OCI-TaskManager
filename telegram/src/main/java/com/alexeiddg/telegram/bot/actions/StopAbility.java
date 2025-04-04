package com.alexeiddg.telegram.bot.actions;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempProjectDataStore;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempSprintDataStore;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempTaskDataStore;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempUserDataStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.abilitybots.api.objects.Ability;
import org.telegram.abilitybots.api.objects.Locality;

import static org.telegram.abilitybots.api.objects.Privacy.PUBLIC;

@Component
@RequiredArgsConstructor
public class StopAbility {

    private final UserSessionManager userSessionManager;
    private final TempTaskDataStore tempTaskDataStore;
    private final TempSprintDataStore tempSprintDataStore;
    private final TempProjectDataStore tempProjectDataStore;
    private final TempUserDataStore tempUserDataStore;

    public void handleStop(BaseAbilityBot bot, Long userId, Long chatId) {
        userSessionManager.clearState(userId);

        // Clear all temporary data
        tempTaskDataStore.clear(userId);
        tempSprintDataStore.clear(userId);
        tempProjectDataStore.clear(userId);
        tempUserDataStore.clear(userId);

        bot.silent().send("Goodbye! 👋", chatId);
        bot.silent().send("🔒 You are now logged out. Type /start to continue working!", chatId);
    }

    public Ability stopAbility(BaseAbilityBot bot) {
        return Ability
                .builder()
                .name("stop")
                .info("Stop the bot")
                .locality(Locality.ALL)
                .privacy(PUBLIC)
                .action(ctx -> {
                    Long chatId = ctx.chatId();
                    Long userId = ctx.user().getId();
                    handleStop(bot, userId, chatId);
                })
                .build();
    }
}
