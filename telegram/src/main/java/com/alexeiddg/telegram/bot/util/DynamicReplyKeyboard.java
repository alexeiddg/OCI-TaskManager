package com.alexeiddg.telegram.bot.util;

import com.alexeiddg.telegram.bot.session.UserState;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;

import java.util.ArrayList;
import java.util.List;

public class DynamicReplyKeyboard {

    public static ReplyKeyboardMarkup generateKeyboardForState(UserState state, List<String> options) {
        ReplyKeyboardMarkup markup = new ReplyKeyboardMarkup();
        markup.setResizeKeyboard(true);

        List<KeyboardRow> keyboard = new ArrayList<>();

        switch (state) {
            case SIGNUP_MANAGER -> {
                for (String mgr : options) {
                    KeyboardRow row = new KeyboardRow();
                    row.add(mgr);
                    keyboard.add(row);
                }
            }

            case PROJECT -> {
                KeyboardRow MenuRow = new KeyboardRow();
                MenuRow.add("Main Menu");
                keyboard.add(MenuRow);

                for (String project : options) {
                    KeyboardRow projectsRow = new KeyboardRow();
                    projectsRow.add(project);
                    keyboard.add(projectsRow);
                }

                KeyboardRow actionsRow = new KeyboardRow();
                actionsRow.add("➕ Create Project");
                actionsRow.add("📝 Update Project");
                actionsRow.add("❌ Delete Project");
                actionsRow.add("🔒 Logout");
                keyboard.add(actionsRow);
            }

            case SPRINT -> {
                KeyboardRow MenuRow = new KeyboardRow();
                MenuRow.add("Main Menu");
                keyboard.add(MenuRow);

                for (String sprint : options) {
                    KeyboardRow sprintsRow = new KeyboardRow();
                    sprintsRow.add(sprint);
                    keyboard.add(sprintsRow);
                }

                KeyboardRow actionsRow = new KeyboardRow();
                actionsRow.add("➕ Create Sprint");
                actionsRow.add("📝 Update Sprint");
                actionsRow.add("❌ Delete Sprint");
                actionsRow.add("🔒 Logout");
                keyboard.add(actionsRow);
            }

            case SPRINT_CREATE_PROJECT_SELECT -> {
                KeyboardRow MenuRow = new KeyboardRow();
                MenuRow.add("Main Menu");
                keyboard.add(MenuRow);

                for (String project : options) {
                    KeyboardRow projectsRow = new KeyboardRow();
                    projectsRow.add(project);
                    keyboard.add(projectsRow);
                }
            }
        }

        markup.setKeyboard(keyboard);
        return markup;
    }
}
