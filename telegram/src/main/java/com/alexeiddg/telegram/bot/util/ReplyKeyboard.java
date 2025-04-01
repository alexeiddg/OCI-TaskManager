package com.alexeiddg.telegram.bot.util;

import com.alexeiddg.telegram.bot.session.UserState;
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
                KeyboardRow row = new KeyboardRow();
                row.add("📝 Sign up");
                row.add("📝 Login w/username");
                keyboard.add(row);
            }

            case SIGNUP_ROLE -> {
                KeyboardRow row = new KeyboardRow();
                row.add("Manager");
                row.add("Developer");
                keyboard.add(row);
            }

            case MAIN_MENU -> {
                KeyboardRow row = new KeyboardRow();
                row.add("View Current Projects");
                row.add("View Current Sprint");
                row.add("📝 Create Task");
                row.add("📋 View Tasks");
                row.add("🔒 Logout");
                keyboard.add(row);
            }
        }

        markup.setKeyboard(keyboard);
        return markup;
    }
}
