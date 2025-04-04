package com.alexeiddg.telegram.bot.util.tempDataStore;

import model.Project;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TempProjectDataStore {
    private final Map<Long, Project> projectData = new ConcurrentHashMap<>();

    public void set(Long userId, Project project) {
        projectData.put(userId, project);
    }

    public Project get(Long userId) {
        return projectData.get(userId);
    }

    public void clear(Long userId) {
        projectData.remove(userId);
    }
}
