package com.alexeiddg.telegram.bot.actions;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.abilitybots.api.objects.Ability;
import org.telegram.abilitybots.api.objects.Locality;
import org.telegram.abilitybots.api.objects.Privacy;

@Component
@RequiredArgsConstructor
public class SignUpAbility {

    public void beginSignup(BaseAbilityBot bot, Long chatId) {
        bot.silent().send("📝 Please enter your name to begin registration:", chatId);
    }

    public Ability signUp(BaseAbilityBot bot) {
        return Ability
                .builder()
                .name("signup")
                .info("Sign up command")
                .locality(Locality.ALL)
                .privacy(Privacy.PUBLIC)
                .action(ctx -> {
                    Long chatId = ctx.chatId();

                    bot.silent().send("Please enter your username", chatId);
                })
                .build();
    }
}
