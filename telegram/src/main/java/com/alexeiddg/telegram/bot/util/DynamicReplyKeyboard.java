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

            case TASK -> {
                KeyboardRow MenuRow = new KeyboardRow();
                MenuRow.add("Main Menu");
                keyboard.add(MenuRow);

                KeyboardRow tasksOptionsRow = new KeyboardRow();
                tasksOptionsRow.add("Start Task");
                tasksOptionsRow.add("Complete Task");
                tasksOptionsRow.add("Reopen Task");
                keyboard.add(tasksOptionsRow);

                for (String task : options) {
                    KeyboardRow tasksRow = new KeyboardRow();
                    tasksRow.add(task);
                    keyboard.add(tasksRow);
                }

                KeyboardRow actionsRow = new KeyboardRow();
                actionsRow.add("➕ Create Task");
                actionsRow.add("📝 Update Task");
                actionsRow.add("❌ Delete Task");
                keyboard.add(actionsRow);

                KeyboardRow logoutRow = new KeyboardRow();
                logoutRow.add("🔒 Logout");
                keyboard.add(logoutRow);
            }

            case TASK_CREATE_ASSIGNEE -> {
                KeyboardRow MenuRow = new KeyboardRow();
                MenuRow.add("Assign to self");
                keyboard.add(MenuRow);

                KeyboardRow usersRow = new KeyboardRow();
                for (String user : options) {
                    usersRow.add(user);
                }
                keyboard.add(usersRow);
            }

            case TASK_CREATE_SPRINT -> {
                for (String sprint : options) {
                    KeyboardRow sprintsRow = new KeyboardRow();
                    sprintsRow.add(sprint);
                    keyboard.add(sprintsRow);
                }
            }
        }

        markup.setKeyboard(keyboard);
        return markup;
    }
}
