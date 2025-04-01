package com.alexeiddg.telegram.bot.actions;

import com.alexeiddg.telegram.service.AppUserService;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.abilitybots.api.objects.Ability;
import org.telegram.abilitybots.api.objects.Locality;
import org.telegram.abilitybots.api.objects.Privacy;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class StartAbility {

    private final AppUserService appUserService;

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

                        String response = String.format("👋 Hello, %s (@%s)! Let's get working!", name, username);
                        bot.silent().send(response, chatId);
                    } else {
                       bot.silent().send("Welcome to the task manager bot! let's get you registered", chatId);
                    }
                })
                .build();
    }
}
