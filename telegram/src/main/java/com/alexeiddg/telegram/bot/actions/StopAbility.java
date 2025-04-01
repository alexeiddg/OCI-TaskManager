package com.alexeiddg.telegram.bot.actions;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
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

    public void handleStop(BaseAbilityBot bot, Long userId, Long chatId) {
        userSessionManager.clearState(userId);
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
