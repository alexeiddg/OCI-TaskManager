package com.alexeiddg.web.service;

import enums.TaskStatus;
import lombok.RequiredArgsConstructor;
import model.Task;
import org.springframework.stereotype.Service;
import repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public List<Task> getTasksCreatedByUser(Long userId) {
        return taskRepository.findAllByCreatedById(userId);
    }

    public List<Task> getTasksAssignedToUser(Long userId) {
        return taskRepository.findAllByAssignedToId(userId);
    }


    public boolean markTaskAsCompleted(Long taskId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);

        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setStatus(TaskStatus.DONE);
            task.setIsActive(false);
            task.setCompletedAt(LocalDateTime.now());
            taskRepository.save(task);
            return true;
        }

        return false;
    }
}
