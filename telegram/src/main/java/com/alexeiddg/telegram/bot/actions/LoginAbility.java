package com.alexeiddg.telegram.bot.actions;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.tempDataStore.TempLoginDataStore;
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
    private final TempLoginDataStore tempLoginDataStore;
    private final StartAbility startAbility;

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

        if (state == UserState.LOGIN_USERNAME) {
            Optional<AppUser> userOpt = appUserService.getUserByUsername(text);

            if (userOpt.isEmpty()) {
                bot.silent().send("❌ Username not found. Please ensure you typed it correctly.", chatId);
                userSessionManager.clearState(userId);
                return;
            }

            tempLoginDataStore.setTempUsername(userId, text);
            userSessionManager.setState(userId, UserState.LOGIN_PASSWORD);
            bot.silent().send("🔐 Please enter your password:", chatId);
            return;
        }

        if (state == UserState.LOGIN_PASSWORD) {
            String username = tempLoginDataStore.getTempUsername(userId);
            if (username == null) {
                bot.silent().send("⚠️ Session expired. Please /login again.", chatId);
                userSessionManager.clearState(userId);
                return;
            }

            Optional<AppUser> userOpt = appUserService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                bot.silent().send("❌ Unexpected error. Please /login again.", chatId);
                userSessionManager.clearState(userId);
                return;
            }

            AppUser user = userOpt.get();

            // Check password
            if (!appUserService.checkPassword(text, user.getPassword())) {
                bot.silent().send("❌ Incorrect password. Try again.", chatId);
                return;
            }

            // Password is correct
            if (user.getTelegramId() == null || user.getTelegramId().isEmpty()) {
                user.setTelegramId(userId.toString());
                appUserService.updateUser(user);
            } else if (!user.getTelegramId().equals(userId.toString())) {
                bot.silent().send("🚫 That username is linked to another Telegram account.", chatId);
                userSessionManager.clearState(userId);
                return;
            }

            tempLoginDataStore.clearTempUsername(userId);
            bot.silent().send("✅ Login successful. Welcome back!", chatId);
            startAbility.startMainMenu(bot, chatId, userId);
        }
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
