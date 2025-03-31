package com.alexeiddg.telegram.bot.actions;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.abilitybots.api.objects.Ability;
import org.telegram.abilitybots.api.objects.Locality;
import org.telegram.abilitybots.api.objects.Privacy;

@Component
@RequiredArgsConstructor
public class StartAbility {

    public Ability start(BaseAbilityBot bot) {
        return Ability
                .builder()
                .name("start")
                .info("Start command")
                .locality(Locality.ALL)
                .privacy(Privacy.PUBLIC)
                .action(ctx -> {
                    Long chatId = ctx.chatId();
                    Long telegramId = ctx.user().getId(); // User ID is a Long
                    String response = String.format("Hello! Your Telegram ID is %d", telegramId);
                    bot.silent().send(response, chatId);
                })
                .build();
    }
}
