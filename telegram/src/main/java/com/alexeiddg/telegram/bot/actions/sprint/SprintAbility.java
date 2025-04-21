package com.alexeiddg.telegram.bot.actions.sprint;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.bot.session.UserState;
import com.alexeiddg.telegram.bot.util.DynamicReplyKeyboard;
import com.alexeiddg.telegram.service.AppUserService;
import com.alexeiddg.telegram.service.SprintService;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Sprint;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SprintAbility {

    private final SprintService sprintService;
    private final AppUserService appUserService;
    private final UserSessionManager userSessionManager;

    public void viewSprints(BaseAbilityBot bot, Long chatId, Long telegramUserId) {
        AppUser user = appUserService.getUserByTelegramId(telegramUserId.toString()).orElse(null);

        userSessionManager.setState(telegramUserId, UserState.SPRINT);

        if (user == null) {
            bot.silent().send("User not found.", chatId);
        }

        List<Sprint> sprints = sprintService.getSprintsForUser(user.getId());
        List<Sprint> activeSprints = sprints.stream()
                .filter(Sprint::getIsActive)
                .toList();

        if (activeSprints.isEmpty()) {
            bot.silent().send(
                    "No active sprints found for you.\n" +
                            "You can create a new sprint with '➕ Create Sprint'",
                    chatId
            );
        } else {
            StringBuilder message = new StringBuilder("Active Sprints:\n");
            for (Sprint sprint : activeSprints) {
                message.append(String.format("%s (ID: %d)\n", sprint.getSprintName(), sprint.getId()));
            }
            bot.silent().send(message.toString(), chatId);
        }

        SendMessage msg = new SendMessage();
        msg.setChatId(chatId.toString());
        msg.setText("Select an action:");
        msg.setReplyMarkup(DynamicReplyKeyboard.generateKeyboardForState(UserState.SPRINT, activeSprints.stream()
                .map(sprint -> String.format("%s (ID: %d)", sprint.getSprintName(), sprint.getId()))
                .toList()));

        try {
            bot.execute(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
