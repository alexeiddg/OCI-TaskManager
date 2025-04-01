package com.alexeiddg.telegram.bot.actions;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.service.AppUserService;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.abilitybots.api.objects.Ability;
import org.telegram.abilitybots.api.objects.Locality;
import org.telegram.abilitybots.api.objects.Privacy;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class LoginAbility {

    private final AppUserService appUserService;
    private final UserSessionManager userSessionManager;

    public void beginLogin(BaseAbilityBot bot, Long chatId) {
        userSessionManager.setState(chatId, UserState.LOGIN_USERNAME);
        bot.silent().send("📝 Please enter your username to login:", chatId);
    }

    public void handleLogin(BaseAbilityBot bot, Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) return;

        String text = update.getMessage().getText();
        Long chatId = update.getMessage().getChatId();
        Long userId = update.getMessage().getFrom().getId();

        UserState state = userSessionManager.getState(userId);

        // Expect state to be LOGIN_USERNAME
        if (state == UserState.LOGIN_USERNAME) {
            Optional<AppUser> userOpt = appUserService.getUserByUsername(text);

            // Check if user exists
            if (userOpt.isPresent()) {
                AppUser user = userOpt.get();

                // If user has no telegram ID, link it
                if (user.getTelegramId() == null || user.getTelegramId().isEmpty()) {
                    user.setTelegramId(userId.toString());
                    appUserService.updateUser(user);

                    bot.silent().send("✅ Login successful. Your account is now linked to Telegram.", chatId);
                } else if (user.getTelegramId().equals(userId.toString())) {
                    // Already the same user re-logging
                    bot.silent().send("🔓 You’re already logged in.", chatId);

                }
            } else {
                // Telegram ID mismatch
                bot.silent().send("❌ That username is already linked to a different Telegram account.", chatId);
            }
        }  else {
            bot.silent().send("❌ Username not found. Please ensure you typed it correctly.", chatId);
        }
        // Clear state
        userSessionManager.clearState(userId);
    }

    public Ability login(BaseAbilityBot bot) {
        return Ability
                .builder()
                .name("login")
                .info("Login to your account")
                .locality(Locality.ALL)
                .privacy(Privacy.PUBLIC)
                .action(ctx -> {
                    beginLogin(bot, ctx.chatId());
                })
                .build();
    }
}
