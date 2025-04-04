package com.alexeiddg.telegram.bot.util.tempDataStore;

import model.AppUser;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Stores in-progress AppUser creation data, step-by-step, per user.
 */

@Component
public class TempUserDataStore {

    private final Map<Long, AppUser> tempUsers = new ConcurrentHashMap<>();

    public void set(Long userId, AppUser user) {
        tempUsers.put(userId, user);
    }

    public AppUser get(Long userId) {
        return tempUsers.get(userId);
    }

    public void clear(Long userId) {
        tempUsers.remove(userId);
    }

    public boolean exists(Long userId) {
        return tempUsers.containsKey(userId);
    }
}
