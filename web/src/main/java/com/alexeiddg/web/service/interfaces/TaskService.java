package com.alexeiddg.web.service.interfaces;

import com.alexeiddg.web.model.Task;
import com.alexeiddg.web.model.Team;

import java.util.List;
import java.util.Optional;

public interface TaskService {
    Optional<Task> getTaskById(Long taskId);
    Task saveTask(Task task);
    void deleteTask(Long taskId);

    Task assignTaskToUser(Long taskId, Long userId);
    Task updateTaskStatus(Long taskId, String status);
    Task setTaskBlocked(Long taskId, boolean isBlocked);

    List<Task> getTasksByAssignedUser(Long userId);
    List<Task> getTasksByTeam(Long teamId);
    List<Task> getTasksBySprint(Long sprintId);
    List<Task> getTasksByProject(Long projectId);

    int getTotalTasksBySprint(Long sprintId);
    int getCompletedTasksBySprint(Long sprintId);
    int getBlockedTasksBySprint(Long sprintId);
    int getTotalTasksByProject(Long projectId);
    int getCompletedTasksByProject(Long projectId);
}