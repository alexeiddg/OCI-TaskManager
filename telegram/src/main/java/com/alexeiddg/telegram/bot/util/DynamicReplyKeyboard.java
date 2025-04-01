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
        }

        markup.setKeyboard(keyboard);
        return markup;
    }
}
