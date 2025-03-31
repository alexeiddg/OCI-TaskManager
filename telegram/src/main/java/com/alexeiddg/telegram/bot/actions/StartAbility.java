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
                .action(ctx -> bot.silent().send("Hello, welcome to Task Manager Bot! Let's get you started", ctx.chatId()))
                .build();
    }
}
