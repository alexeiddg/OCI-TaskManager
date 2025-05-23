package com.alexeiddg.telegram.bot.actions;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.ReplyKeyboard;
import com.alexeiddg.telegram.service.AppUserService;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.abilitybots.api.objects.Ability;
import org.telegram.abilitybots.api.objects.Locality;
import org.telegram.abilitybots.api.objects.Privacy;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class StartAbility {

    private final AppUserService appUserService;
    private final UserSessionManager userSessionManager;

    public Ability start(BaseAbilityBot bot) {
        return Ability
                .builder()
                .name("start")
                .info("Start command")
                .locality(Locality.ALL)
                .privacy(Privacy.PUBLIC)
                .action(ctx -> {
                    Long chatId = ctx.chatId();
                    Long telegramId = ctx.user().getId();

                    if (appUserService.getUserByTelegramId(telegramId.toString()).isPresent()) {
                        Optional<AppUser> user = appUserService.getUserByTelegramId(telegramId.toString());

                        String name = user.get().getName();
                        String username = user.get().getUsername();

                        userSessionManager.setState(telegramId, UserState.MAIN_MENU);

                        String response = String.format("👋 Hello, %s (@%s)! Let's get working!", name, username);
                        bot.silent().send(response, chatId);

                        // send the main menu keyboard
                        startMainMenu(bot, chatId, telegramId);
                    }

                    else {
                       bot.silent().send("Welcome to the task manager bot! let's get you registered", chatId);

                       ReplyKeyboardMarkup markup = ReplyKeyboard.generateKeyboardForState(UserState.SIGNUP);


                       SendMessage message = new SendMessage();
                       message.setChatId(chatId.toString());
                       message.setText("Click '📝 Sign up' to begin registration! or \n Click '👤 Login' to login");
                       message.setReplyMarkup(markup);

                       try {
                           bot.execute(message);
                       } catch (Exception e) {
                           e.printStackTrace();
                       }
                    }
                })
                .build();
    }

    public void startMainMenu(BaseAbilityBot bot, Long chatId, Long telegramId) {
        userSessionManager.setState(telegramId, UserState.MAIN_MENU);

        SendMessage message = new SendMessage();
        message.setChatId(chatId.toString());
        message.setText("🏠 Main Menu");
        message.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.MAIN_MENU));

        try {
            bot.execute(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
