package com.alexeiddg.telegram.bot.session;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class UserSessionManager {

    private final Map<Long, UserState> userState = new ConcurrentHashMap<>();

    public void setState(Long userId, UserState state) {
        userState.put(userId, state);
    }

    public UserState getState(Long userId) {
        return userState.getOrDefault(userId, UserState.NONE);
    }

    public void clearState(Long userId) {
        userState.remove(userId);
    }

    public boolean isInStep(Long userId, UserState step) {
        return getState(userId) == step;
    }
}
