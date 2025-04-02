package com.alexeiddg.telegram.bot.actions;

import com.alexeiddg.telegram.bot.session.UserSessionManager;
import com.alexeiddg.telegram.service.AppUserService;
import com.alexeiddg.telegram.service.ProjectService;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import org.springframework.stereotype.Component;
import org.telegram.abilitybots.api.bot.BaseAbilityBot;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MainMenuAbility {

    private final AppUserService appUserService;
    private final ProjectService projectService;
    private final UserSessionManager userSessionManager;

    public void beginMainMenu(BaseAbilityBot bot, Long chatId, Long telegramUserId) {
        Optional<AppUser> userOpt = appUserService.getUserByTelegramId(telegramUserId.toString());

        if (userOpt.isPresent()) {
            AppUser user = userOpt.get();
            Long userId = user.getId();

            if (user.getRole().equals(UserRole.DEVELOPER)) {
                // Check if user has a team
                var projects = projectService.getProjectsByDeveloperId(userId);
                if (projects.isEmpty()) {
                    bot.silent().send(
                            "No projects assigned yet. Wait for a manager to assign them to you!",
                            chatId
                    );
                } else {
                    bot.silent().send("You have " + projects.size() + " projects assigned.", chatId);
                }
            }

            else if (user.getRole().equals(UserRole.MANAGER)) {
                // Check if user has a team
                var projects = projectService.getProjectsByManagerId(userId);
                if (projects.isEmpty()) {
                    bot.silent().send("You have no projects yet. Use 'View Projects' to get started!", chatId);
                } else {
                    bot.silent().send("You manage " + projects.size() + " projects.", chatId);
                }
            }

        } else {
            bot.silent().send("❌ User not found. Please make you are logged in or use /start.", chatId);
            userSessionManager.clearState(telegramUserId);
        }
    }
}
