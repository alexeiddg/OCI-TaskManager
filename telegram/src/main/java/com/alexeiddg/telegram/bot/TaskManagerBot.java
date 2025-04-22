package com.alexeiddg.telegram.bot;

import com.alexeiddg.telegram.bot.actions.*;
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
    private final BotAbilities botAbilities;

    public TaskManagerBot(
            @Value("${telegram.bot.username}") String botUsername,
            @Value("${telegram.bot.token}") String botToken,
            UserSessionManager userSessionManager,
            BotAbilities botAbilities
    ) {
        super(botToken, botUsername);
        this.userSessionManager = userSessionManager;
        this.botAbilities = botAbilities;
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

            System.out.println("DEBUG: Reached MainBot State with state = " + state);

            // Start Ability flow for signup
            if (messageText.equals("📝 Sign up")) {
                botAbilities.signUp().beginSignup(this, chatId);
            }

            // Start Ability flow for login
            if (messageText.equals("👤 Login")) {
                botAbilities.login().beginLogin(this, chatId);
            }

            if (state == UserState.LOGIN_USERNAME || state == UserState.LOGIN_PASSWORD) {
                botAbilities.login().handleLogin(this, update);
            }

            /**
             * Core functionality of the bot
             * */

            if (messageText.equals("🏠 Main Menu")) {
                botAbilities.start().startMainMenu(this, chatId, userId);
            }

            if (messageText.equals("📝 View Current Tasks")){
                botAbilities.taskAbility().viewTasks(this, chatId, userId);
            }

            if (messageText.equals("Start Task")) {
                botAbilities.taskAbility().startTask(this, chatId, userId);
            }

            if (state == UserState.TASK_SELECT_START) {
                botAbilities.taskAbility().handleStartTask(this, update);
            }

            if (messageText.equals("Complete Task")) {
                botAbilities.taskAbility().completeTask(this, chatId, userId);
            }

            if (state == UserState.TASK_SELECT_COMPLETE) {
                botAbilities.taskAbility().handleCompleteTask(this, update);
            }

            if (messageText.equals("Reopen Task")) {
                botAbilities.taskAbility().reopenTask(this, chatId, userId);
            }

            if (state == UserState.TASK_SELECT_REOPEN) {
                botAbilities.taskAbility().handleReopenTask(this, update);
            }

            if (state == UserState.TASK) {
                botAbilities.taskAbility().handleTaskDetails(this, update);
            }

            if (messageText.equals("📝 Create Task") || messageText.equals("➕ Create Task")) {
                botAbilities.createTaskAbility().createTask(this, chatId, userId);
            }


            if (state == UserState.TASK_LOG_HOURS) {
                botAbilities.taskAbility().handleLoggedHours(this, update);
            }

            if (messageText.equals("❌ Delete Task")) {
                botAbilities.deleteTaskAbility().deleteTask(this, chatId, userId);
            }

            if (state == UserState.TASK_DELETE) {
                botAbilities.deleteTaskAbility().handleDeleteTask(this, update);
            }

            if (messageText.equals("📝 Update Task")) {
                botAbilities.updateTaskAbility().updateTask(this, chatId, userId);
            }

            if (
                    state == UserState.TASK_UPDATE_SELECT ||
                            state == UserState.TASK_UPDATE ||
                            state == UserState.TASK_UPDATE_NAME ||
                            state == UserState.TASK_UPDATE_DESCRIPTION ||
                            state == UserState.TASK_UPDATE_PRIORITY ||
                            state == UserState.TASK_UPDATE_STATUS ||
                            state == UserState.TASK_UPDATE_TYPE ||
                            state == UserState.TASK_UPDATE_STORY_POINTS ||
                            state == UserState.TASK_UPDATE_DUE_DATE ||
                            state == UserState.TASK_UPDATE_BLOCKED ||
                            state == UserState.TASK_UPDATE_LOG_HOURS ||
                            state == UserState.TASK_UPDATE_ASSIGNEE
            ) {
                botAbilities.updateTaskAbility().handleUpdateTask(this, update);
            }

            if (messageText.equals("📊 Reports")){
                botAbilities.reportsAbility().ReportsMenu(this, chatId, userId);
            }

            if (messageText.equals("📊 Personal Report")){
                botAbilities.reportsAbility().showPersonalReport(this, chatId, userId);
            }

            if (messageText.equals("👥 Team Report")) {
                botAbilities.reportsAbility().showTeamReport(this, chatId, userId);
            }

            if (messageText.equals("🔒 Logout")) {
                botAbilities.stop().handleStop(this, userId, chatId);
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
        return botAbilities.start().start(this);
    }

    public Ability login() {
        return botAbilities.login().login(this);
    }

    // TODO: Impl stateless abilities
}
