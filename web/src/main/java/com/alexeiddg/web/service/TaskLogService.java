package com.alexeiddg.web.service;

import DTO.domian.TaskLogDto;
import DTO.setup.CreateTaskLogRequest;
import jakarta.transaction.Transactional;
import model.AppUser;
import model.Task;
import model.TaskLog;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;
import repository.TaskLogRepository;
import repository.TaskRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskLogService {
    private final TaskLogRepository logRepo;
    private final TaskRepository taskRepo;
    private final AppUserRepository userRepo;

    public TaskLogService(TaskLogRepository logRepo,
                          TaskRepository taskRepo,
                          AppUserRepository userRepo) {
        this.logRepo = logRepo;
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
    }

    public List<TaskLogDto> getLogsForTaskAndUser(Long taskId, Long userId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        AppUser user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return logRepo.findByTaskAndUser(task, user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskLogDto addLog(Long pathTaskId, CreateTaskLogRequest req) {
        if (!pathTaskId.equals(req.taskId())) {
            throw new IllegalArgumentException("URL taskId does not match body.taskId");
        }
        Task task = taskRepo.findById(req.taskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        AppUser user = userRepo.findById(req.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TaskLog log = TaskLog.builder()
                .task(task)
                .user(user)
                .hoursLogged(req.hoursLogged())
                .build();

        TaskLog saved = logRepo.save(log);
        return toDto(saved);
    }

    private TaskLogDto toDto(TaskLog log) {
        return new TaskLogDto(
                log.getId(),
                log.getTask().getId(),
                log.getUser().getId(),
                log.getHoursLogged(),
                log.getLogDate()
        );
    }
}
