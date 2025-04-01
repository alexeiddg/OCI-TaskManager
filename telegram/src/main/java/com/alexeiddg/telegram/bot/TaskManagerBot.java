package com.alexeiddg.telegram.bot;

import com.alexeiddg.telegram.bot.actions.LoginAbility;
import com.alexeiddg.telegram.bot.actions.SignUpAbility;
import com.alexeiddg.telegram.bot.actions.StartAbility;
import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.AbilityBot;
import org.telegram.abilitybots.api.objects.Ability;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

/**
 * Main class responsible for initializing and registering the Telegram bot.
 * The bot is registered automatically on application startup using the {@code @PostConstruct} annotation.
 * It extends {@link AbilityBot} to handle abilities and user interactions.
 */

@Slf4j
@Component
public class TaskManagerBot extends AbilityBot {

    private final UserSessionManager userSessionManager;
    private final StartAbility start;
    private final SignUpAbility signUp;
    private final LoginAbility login;

    public TaskManagerBot(
            @Value("${telegram.bot.username}") String botUsername,
            @Value("${telegram.bot.token}") String botToken,
            UserSessionManager userSessionManager,
            StartAbility start,
            SignUpAbility signUp, LoginAbility login
    ) {
        super(botToken, botUsername);
        this.userSessionManager = userSessionManager;

        // Abilities Init
        this.start = start;
        this.signUp = signUp;
        this.login = login;
    }

    /**
     * Initializes and registers the bot instance with the Telegram API.
     * Called once by Spring after dependency injection is completed.
     */

    @PostConstruct
    public void registerBot() {
        try {
            TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
            botsApi.registerBot(this);
        } catch (Exception e) {
            TaskManagerBot.log.error("Error while registering bot", e);
        }
    }

    @Override
    public long creatorId() {
        return 1L;
    }

    /**
     * Handles incoming updates from Telegram.
     * This override ensures that {@link AbilityBot} still processes updates,
     * and also adds custom handling for callback queries (e.g., button clicks).
     * Maintains the state of the user session and command flow
     * e.g. /start to /signup steps
     */

    @Override
    public void onUpdateReceived(Update update) {
        super.onUpdateReceived(update);

        if(update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            Long chatId = update.getMessage().getChatId();
            Long userId = update.getMessage().getFrom().getId();
            UserState state = userSessionManager.getState(userId);

            // Start Ability flow for signup
            if (messageText.equals("📝 Sign up")) {
                signUp.beginSignup(this, chatId);
            }

            // Handle signup flow based on the current state
            if (state == UserState.SIGNUP_NAME ||
                    state == UserState.SIGNUP_USERNAME ||
                    state == UserState.SIGNUP_ROLE ||
                    state == UserState.SIGNUP_MANAGER
            ) {

                signUp.handleSignUp(this, update);
            }

            // Begin Login on click
            if (messageText.equals("👤 Login w/username")) {
                login.beginLogin(this, chatId);
            }

            // handle login
            if (state == UserState.LOGIN_USERNAME) {
                login.handleLogin(this, update);
            }
        }
    }

    /**
     * Returns the ability associated with the {@code /{ability}} command.
     * e.g. {@code /start} or {@code /signup}
     * This method is automatically detected by AbilityBot and registered as a command.
     * No state is maintained between invocations.
     */

    public Ability start() {
        return start.start(this);
    }

    public Ability signUp() {
        return signUp.signUp(this);
    }

    public Ability login() {
        return login.login(this);
    }
}
