package com.alexeiddg.telegram.bot;

import com.alexeiddg.telegram.bot.actions.*;
import com.alexeiddg.telegram.bot.actions.project.CreateProjectAbility;
import com.alexeiddg.telegram.bot.actions.project.DeleteProjectAbility;
import com.alexeiddg.telegram.bot.actions.project.ProjectAbility;
import com.alexeiddg.telegram.bot.actions.sprint.CreateSprintAbility;
import com.alexeiddg.telegram.bot.actions.sprint.SprintAbility;
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
    private final StopAbility stop;
    private final ProjectAbility projectAbility;
    private final CreateProjectAbility createProjectAbility;
    private final DeleteProjectAbility deleteProjectAbility;
    private final SprintAbility sprintAbility;
    private final CreateSprintAbility createSprintAbility;

    public TaskManagerBot(
            @Value("${telegram.bot.username}") String botUsername,
            @Value("${telegram.bot.token}") String botToken,
            UserSessionManager userSessionManager,
            StartAbility start,
            SignUpAbility signUp,
            LoginAbility login,
            StopAbility stop,
            ProjectAbility projectAbility,
            CreateProjectAbility createProjectAbility,
            DeleteProjectAbility deleteProjectAbility,
            SprintAbility sprintAbility,
            CreateSprintAbility createSprintAbility
    ) {
        super(botToken, botUsername);
        this.userSessionManager = userSessionManager;

        // Abilities Init
        this.start = start;
        this.signUp = signUp;
        this.login = login;
        this.stop = stop;
        this.projectAbility = projectAbility;
        this.createProjectAbility = createProjectAbility;
        this.deleteProjectAbility = deleteProjectAbility;
        this.sprintAbility = sprintAbility;
        this.createSprintAbility = createSprintAbility;
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

            // Start projects workflow
            if (messageText.equals("View Current Projects")) {
                projectAbility.ViewProjects(this, chatId, userId);
            }

            // Handle back to main menu
            if (messageText.equals("Main Menu")) {
                start.startMainMenu(this, chatId, userId);
            }

            if (messageText.equals("➕ Create Project")) {
                projectAbility.createProject(this, chatId, userId);
            }

            // Handle state update for project creation
            if (state == UserState.PROJECT_CREATE_NAME
                    || state == UserState.PROJECT_CREATE_DESCRIPTION
                    || state == UserState.PROJECT_CREATE_MANAGER
                    || state == UserState.PROJECT_CREATE_TEAM_DECISION
                    || state == UserState.PROJECT_CREATE_TEAM_SELECT
                    || state == UserState.PROJECT_CREATE_CONFIRMATION
            ) {
                createProjectAbility.handleCreateProject(this, update);
            }

            if (messageText.equals("❌ Delete Project")) {
                projectAbility.deleteProject(this, chatId, userId);
            }

            if (state == UserState.PROJECT_DELETE ) {
                deleteProjectAbility.deleteProject(this, update);
            }

            if (state == UserState.PROJECT_DELETE_CONFIRM) {
                deleteProjectAbility.confirmDelete(this, update);
            }

            if (messageText.equals("View Current Sprint")) {
                sprintAbility.viewSprints(this, chatId, userId);
            }

            if (messageText.equals("➕ Create Sprint")) {
                createSprintAbility.createSprint(this, chatId, userId);
            }

            if (state == UserState.SPRINT_CREATE_PROJECT_SELECT
                    || state == UserState.SPRINT_CREATE_NAME
                    || state == UserState.SPRINT_CREATE_START_DATE
                    || state == UserState.SPRINT_CREATE_END_DATE
                    || state == UserState.SPRINT_CREATE_CONFIRMATION
            ) {
                createSprintAbility.handleCreateSprint(this, update);
            }

            // Handle logout
            if (messageText.equals("🔒 Logout")) {
                stop.handleStop(this, userId, chatId);
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

    public Ability stop() {
        return stop.stopAbility(this);
    }

    // TODO: Impl stateless abilities
}
