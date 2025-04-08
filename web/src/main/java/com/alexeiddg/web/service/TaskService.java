package com.alexeiddg.web.service;

import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Task;
import org.springframework.stereotype.Service;
import repository.AppUserRepository;
import repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final AppUserRepository userRepository;

    // Create
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Update
    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }

    // Delete
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    // Soft delete
    public void softDeleteTask(Long id) {
        taskRepository.findById(id).ifPresent(task -> {
            task.setIsActive(false);
            taskRepository.save(task);
        });
    }

    // Get all tasks for a user
    public List<Task> getTasksAssignedToUser(Long userId) {
        return taskRepository.findAllByAssignedToId(userId);
    }

    // Get all tasks for a sprint
    public List<Task> getTasksBySprint(Long sprintId) {
        return taskRepository.findAllBySprintId(sprintId);
    }

    // Get all tasks for a user by sprint
    public List<Task> getTasksByUserAndSprint(Long userId, Long sprintId) {
        return taskRepository.findAllByAssignedToIdAndSprintId(userId, sprintId);
    }

    // Filter created tasks by user
    public List<Task> getTasksCreatedByUser(Long userId) {
        return taskRepository.findAllByCreatedById(userId);
    }

    // Filter tasks by status for user
    public List<Task> getTasksByStatusForUser(TaskStatus status, Long userId) {
        return taskRepository.findAllByStatusAndAssignedToId(status, userId);
    }

    // Filter tasks by type for user
    public List<Task> getTasksByTypeForUser(TaskType type, Long userId) {
        return taskRepository.findAllByTypeAndAssignedToId(type, userId);
    }

    // Filter tasks by priority for user
    public List<Task> getTasksByPriorityForUser(TaskPriority priority, Long userId) {
        return taskRepository.findAllByPriorityAndAssignedToId(priority, userId);
    }

    // Filter tasks by due date for user
    public List<Task> getTasksDueBeforeForUser(LocalDateTime dateTime, Long userId) {
        return taskRepository.findAllByDueDateBeforeAndAssignedToId(dateTime, userId);
    }

    // Filter tasks by story points for user
    public List<Task> getTasksByMinStoryPointsForUser(int points, Long userId) {
        return taskRepository.findAllByStoryPointsGreaterThanEqualAndAssignedToId(points, userId);
    }

    // Filter tasks by blocked status for user
    public List<Task> getBlockedTasksByUser(Long userId) {
        return taskRepository.findAllByBlockedTrueAndAssignedToId(userId);
    }

    // Filter tasks by completed status for user
    public List<Task> getCompletedTasksForUser(Long userId) {
        return taskRepository.findAllByCompletedAtIsNotNullAndAssignedToId(userId);
    }

    // Assign user to task
    public void assignUserToTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        task.setAssignedTo(user);
        taskRepository.save(task);
    }

    // Mark task as completed
    public void markTaskAsCompleted(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        task.setStatus(TaskStatus.DONE);
        task.setCompletedAt(LocalDateTime.now());
        taskRepository.save(task);
    }

    // Block / unblock task
    public void toggleBlocked(Long taskId, boolean blocked) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        task.setBlocked(blocked);
        taskRepository.save(task);
    }

    // Get overdue tasks for user
    public List<Task> getOverdueTasksForUser(Long userId) {
        return taskRepository.findAllByDueDateBeforeAndStatusNotAndAssignedToId(LocalDateTime.now(), TaskStatus.DONE, userId);
    }
}
