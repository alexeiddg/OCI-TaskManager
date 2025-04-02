package com.alexeiddg.telegram.bot.actions;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.DynamicReplyKeyboard;
import com.alexeiddg.telegram.bot.util.ReplyKeyboard;
import com.alexeiddg.telegram.bot.util.TempUserDataStore;
import com.alexeiddg.telegram.service.AppUserService;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.abilitybots.api.objects.Ability;
import org.telegram.abilitybots.api.objects.Locality;
import org.telegram.abilitybots.api.objects.Privacy;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SignUpAbility {

    private final UserSessionManager userSessionManager;
    private final TempUserDataStore tempUserDataStore;
    private final AppUserService appUserService;
    private final MainMenuAbility mainMenuAbility;

    // Start the signup process
    public void beginSignup(BaseAbilityBot bot, Long chatId) {
        userSessionManager.setState(chatId, UserState.SIGNUP_NAME);
        bot.silent().send("📝 Please enter your name to begin registration, example: John Doe:", chatId);
    }

    public void handleSignUp(BaseAbilityBot bot, Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) return;

        String text = update.getMessage().getText();
        Long chatId = update.getMessage().getChatId();
        Long userId = update.getMessage().getFrom().getId();
        String telegramId = update.getMessage().getFrom().getId().toString();

        UserState state = userSessionManager.getState(userId);

        switch (state) {
            case SIGNUP_NAME -> {
                AppUser user = new AppUser();
                user.setName(text);
                user.setTelegramId(telegramId);

                // Use tempUserDataStore to store user data temporarily
                tempUserDataStore.set(userId, user);
                userSessionManager.setState(userId, UserState.SIGNUP_USERNAME);

                bot.silent().send("✅ Name saved. Now enter a *username*, example: JohnDoe24:", chatId);
            }

            case SIGNUP_USERNAME -> {
                AppUser user = tempUserDataStore.get(userId);

                if (user != null) {
                    user.setUsername(text);

                    userSessionManager.setState(userId, UserState.SIGNUP_ROLE);

                    // Build new keyboard and message
                    SendMessage msg = new SendMessage();
                    msg.setChatId(chatId.toString());
                    msg.setText("✅ Username saved. Now choose your role: *Manager* or *Developer*:");
                    msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.SIGNUP_ROLE));

                    try {
                        bot.execute(msg);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else {
                    bot.silent().send("⚠️ Something went wrong. Please restart registration with /signup", chatId);
                }
            }

            case SIGNUP_ROLE -> {
                AppUser user = tempUserDataStore.get(userId);

                if (user != null) {
                    if (text.equalsIgnoreCase("manager")) {
                        user.setRole(UserRole.MANAGER);
                        appUserService.createUser(user);

                        // Temp AppUser Obj cleanup
                        tempUserDataStore.clear(userId);

                        // set new state to main menu on successful registration
                        userSessionManager.setState(userId, UserState.MAIN_MENU);
                        bot.silent().send("🎉 You're now registered as *Manager*!", chatId);

                        // Build new Main Menu Keyboard
                        SendMessage msg = new SendMessage();
                        msg.setChatId(chatId.toString());
                        msg.setText("Welcome to the main menu!");
                        msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.MAIN_MENU));

                        try {
                            bot.execute(msg);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                        mainMenuAbility.beginMainMenu(bot, chatId, Long.valueOf(telegramId));
                    } else if (text.equalsIgnoreCase("developer")) {
                        user.setRole(UserRole.DEVELOPER);

                        userSessionManager.setState(userId, UserState.SIGNUP_MANAGER);

                        List<AppUser> managerUsers = appUserService.getAllManagers();
                        List<String> managerUsernames = managerUsers.stream()
                                .map(AppUser::getUsername)
                                .toList();

                        SendMessage msg = new SendMessage();
                        msg.setChatId(chatId.toString());
                        msg.setText("✅ Role saved. Please select your manager from the menu:");
                        msg.setReplyMarkup(DynamicReplyKeyboard.generateKeyboardForState(UserState.SIGNUP_MANAGER, managerUsernames));

                        try {
                            bot.execute(msg);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else {
                        bot.silent().send("❌ Please choose either 'Manager' or 'Developer'.", chatId);
                    }
                }
            }

            case SIGNUP_MANAGER -> {
                AppUser user = tempUserDataStore.get(userId);
                if (user != null) {

                    Optional<AppUser> managerOpt = appUserService.getUserByUsername(text);

                    if (managerOpt.isPresent() && managerOpt.get().getRole() == UserRole.MANAGER) {
                        user.setManager(managerOpt.get());
                        appUserService.createUser(user);

                        // Clean up temp AppUser obj
                        tempUserDataStore.clear(userId);

                        // set new state to main menu on successful registration
                        userSessionManager.setState(userId, UserState.MAIN_MENU);
                        bot.silent().send("🎉 You’re now registered under manager @" + text, chatId);

                        // Build new Main Menu Keyboard
                        SendMessage msg = new SendMessage();
                        msg.setChatId(chatId.toString());
                        msg.setText("Welcome to the main menu!");
                        msg.setReplyMarkup(ReplyKeyboard.generateKeyboardForState(UserState.MAIN_MENU));

                        try {
                            bot.execute(msg);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                        mainMenuAbility.beginMainMenu(bot, chatId, Long.valueOf(telegramId));
                    } else {
                        bot.silent().send("❌ That username is not recognized as a Manager. Please try again.", chatId);
                    }
                }
            }
        }
    }

    // If called with /signup command start the flow
    public Ability signUp(BaseAbilityBot bot) {
        return Ability
                .builder()
                .name("signup")
                .info("Sign up command")
                .locality(Locality.ALL)
                .privacy(Privacy.PUBLIC)
                .action(ctx -> {
                    Long chatId = ctx.chatId();
                    beginSignup(bot, chatId);
                })
                .build();
    }
}

