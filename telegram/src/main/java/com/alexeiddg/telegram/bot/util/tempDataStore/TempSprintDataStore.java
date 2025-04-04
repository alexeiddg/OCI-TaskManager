package com.alexeiddg.telegram.bot.util.tempDataStore;

import model.Sprint;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TempSprintDataStore {

    private final Map<Long, Sprint> sprintMap = new ConcurrentHashMap<>();

    public void set(Long userId, Sprint sprint) {
        sprintMap.put(userId, sprint);
    }

    public Sprint get(Long userId) {
        return sprintMap.get(userId);
    }

    public void clear(Long userId) {
        sprintMap.remove(userId);
    }

    public boolean has(Long userId) {
        return sprintMap.containsKey(userId);
    }
}
