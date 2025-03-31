package com.alexeiddg.telegram.bot;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.AbilityBot;
import org.telegram.abilitybots.api.objects.Ability;
import org.telegram.abilitybots.api.objects.Locality;
import org.telegram.abilitybots.api.objects.Privacy;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

/**
 * This class handles creating the bot and registering it with the Telegram API.
 * The @PostConstruct annotation is used to register the bot when the application starts.
 * Spring will not create the bean by itself, hence the need for the @PostConstruct annotation.
 */

@Slf4j
@Component
public class TaskManagerBot extends AbilityBot {
    public TaskManagerBot(
            @Value("${telegram.bot.username}") String botUsername,
            @Value("${telegram.bot.token}") String botToken)
    {
        super(botToken, botUsername);
    }

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

    public Ability start() {
        return Ability
                .builder()
                .name("start")
                .info("Start command")
                .locality(Locality.ALL)
                .privacy(Privacy.PUBLIC)
                .action(ctx -> silent.send("Hello, welcome to the bot!", ctx.chatId()))
                .build();
    }
}
