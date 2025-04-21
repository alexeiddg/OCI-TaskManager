package com.alexeiddg.telegram.bot.util;

import com.alexeiddg.telegram.bot.session.UserState;
import org.checkerframework.checker.units.qual.K;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;

import java.util.ArrayList;
import java.util.List;

public class ReplyKeyboard {
    public static ReplyKeyboardMarkup generateKeyboardForState(UserState state) {
        ReplyKeyboardMarkup markup = new ReplyKeyboardMarkup();
        markup.setResizeKeyboard(true);

        List<KeyboardRow> keyboard = new ArrayList<>();

        switch (state) {
            case SIGNUP -> {
                KeyboardRow signuprow = new KeyboardRow();
                signuprow.add("📝 Sign up");
                keyboard.add(signuprow);

                KeyboardRow loginrow = new KeyboardRow();
                loginrow.add("👤 Login");
                keyboard.add(loginrow);
            }

            case SIGNUP_ROLE -> {
                KeyboardRow row = new KeyboardRow();
                row.add("Manager");
                row.add("Developer");
                keyboard.add(row);
            }

            case MAIN_MENU -> {
                KeyboardRow row = new KeyboardRow();
                row.add("🏠 Main Menu");
                keyboard.add(row);

                KeyboardRow viewTaskRow = new KeyboardRow();
                viewTaskRow.add("📝 View Current Tasks");
                keyboard.add(viewTaskRow);

                KeyboardRow createTaskRow = new KeyboardRow();
                createTaskRow.add("📝 Create Task");
                keyboard.add(createTaskRow);

                KeyboardRow sprintRow = new KeyboardRow();
                sprintRow.add("🏃 Sprints");
                keyboard.add(sprintRow);

                KeyboardRow projectsRow = new KeyboardRow();
                projectsRow.add("📁 Projects");
                keyboard.add(projectsRow);

                KeyboardRow teamsRow = new KeyboardRow();
                teamsRow.add("👥 Team");
                keyboard.add(teamsRow);

                KeyboardRow reportsRow = new KeyboardRow();
                reportsRow.add("📊 Reports");
                keyboard.add(reportsRow);

                KeyboardRow logoutRow = new KeyboardRow();
                logoutRow.add("🔒 Logout");
                keyboard.add(logoutRow);
            }

            case TASK_CREATE_PRIORITY -> {
                KeyboardRow row = new KeyboardRow();
                row.add("Low");
                row.add("Medium");
                row.add("High");
                keyboard.add(row);
            }

            case TASK_CREATE_TYPE -> {
                KeyboardRow row = new KeyboardRow();
                row.add("Bug");
                row.add("Feature");
                row.add("Improvement");
                keyboard.add(row);
            }

            case TASK_CREATE_STORY_POINTS -> {
                KeyboardRow row = new KeyboardRow();
                row.add("1");
                row.add("2");
                row.add("3");
                row.add("4");
                keyboard.add(row);
            }

            case TASK_UPDATE -> {
                KeyboardRow row = new KeyboardRow();
                row.add("🏠 Main Menu");
                keyboard.add(row);

                KeyboardRow nameRow = new KeyboardRow();
                nameRow.add("🔤 Update Name");
                keyboard.add(nameRow);

                KeyboardRow descRow = new KeyboardRow();
                descRow.add("🗒️ Update Description");
                keyboard.add(descRow);

                KeyboardRow priorityRow = new KeyboardRow();
                priorityRow.add("⚡ Change Priority");
                keyboard.add(priorityRow);

                KeyboardRow statusRow = new KeyboardRow();
                statusRow.add("📊 Change Status");
                keyboard.add(statusRow);

                KeyboardRow typeRow = new KeyboardRow();
                typeRow.add("🛠️ Change Type");
                keyboard.add(typeRow);

                KeyboardRow pointsRow = new KeyboardRow();
                pointsRow.add("📏 Change Story Points");
                keyboard.add(pointsRow);

                KeyboardRow dueDateRow = new KeyboardRow();
                dueDateRow.add("📅 Change Due Date");
                keyboard.add(dueDateRow);

                KeyboardRow blockRow = new KeyboardRow();
                blockRow.add("🚧 Toggle Blocked");
                keyboard.add(blockRow);

                KeyboardRow hoursRow = new KeyboardRow();
                hoursRow.add("⏱️ Log Hours");
                keyboard.add(hoursRow);

                KeyboardRow logoutRow = new KeyboardRow();
                logoutRow.add("🔒 Logout");
                keyboard.add(logoutRow);
            }

            case TASK_UPDATE_SELECT -> {
                keyboard.addAll(generateKeyboardForState(UserState.TASK_UPDATE).getKeyboard());
            }

            case TASK_UPDATE_STATUS -> {
                KeyboardRow row = new KeyboardRow();
                row.add("TODO");
                row.add("IN_PROGRESS");
                row.add("DONE");
                keyboard.add(row);
            }

            case REPORTS_MENU -> {
                KeyboardRow row = new KeyboardRow();
                row.add("🏠 Main Menu");
                keyboard.add(row);

                KeyboardRow personalReportRow = new KeyboardRow();
                personalReportRow.add("📊 Personal Report");
                keyboard.add(personalReportRow);

                KeyboardRow teamReportRow = new KeyboardRow();
                teamReportRow.add("👥 Team Report");
                keyboard.add(teamReportRow);

                KeyboardRow logoutRow = new KeyboardRow();
                logoutRow.add("🔒 Logout");
                keyboard.add(logoutRow);
            }
        }

        markup.setKeyboard(keyboard);
        return markup;
    }
}
