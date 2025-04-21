package com.alexeiddg.telegram.service;

import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Task;
import model.TaskLog;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import repository.TaskLogRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskLogService {

    private final TaskLogRepository taskLogRepository;

    @Transactional
    public void createInitialLog(Task task, AppUser user) {
        TaskLog log = TaskLog.builder()
                .task(task)
                .user(user)
                .hoursLogged(0.0)
                .build();

        taskLogRepository.save(log);
    }

    public void logHours(Task task, AppUser user, double hours) {
        TaskLog log = TaskLog.builder()
                .task(task)
                .user(user)
                .hoursLogged(hours)
                .build();
        taskLogRepository.save(log);
    }

    public double getLoggedHours(Task task, AppUser user) {
        return taskLogRepository.sumHoursByTaskAndUser(task, user);
    }
}
