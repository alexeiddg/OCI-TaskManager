package com.alexeiddg.telegram.bot.util.tempDataStore;

import model.Task;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TempTaskDataStore {
    private final Map<Long, Task> taskStore = new ConcurrentHashMap<>();

    public void set(Long telegramUserId, Task task) {
        taskStore.put(telegramUserId, task);
    }

    public Task get(Long telegramUserId) {
        return taskStore.get(telegramUserId);
    }

    public void clear(Long telegramUserId) {
        taskStore.remove(telegramUserId);
    }

    public boolean has(Long telegramUserId) {
        return taskStore.containsKey(telegramUserId);
    }
}
