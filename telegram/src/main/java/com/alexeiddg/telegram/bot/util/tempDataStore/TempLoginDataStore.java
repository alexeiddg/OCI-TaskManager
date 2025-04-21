package com.alexeiddg.telegram.bot.util.tempDataStore;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TempLoginDataStore {
    private final Map<Long, String> tempUsernames = new ConcurrentHashMap<>();

    public void setTempUsername(Long userId, String username) {
        tempUsernames.put(userId, username);
    }

    public String getTempUsername(Long userId) {
        return tempUsernames.get(userId);
    }

    public void clearTempUsername(Long userId) {
        tempUsernames.remove(userId);
    }
}
