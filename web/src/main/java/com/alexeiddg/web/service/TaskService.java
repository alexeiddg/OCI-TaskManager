package com.alexeiddg.web.service;

import DTO.domian.TaskDto;
import DTO.domian.mappers.TaskMapper;
import DTO.setup.TaskCreationRequest;
import enums.ChangeType;
import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;
import lombok.RequiredArgsConstructor;
import model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final AppUserRepository appUserRepository;
    private final SprintRepository sprintRepository;
    private final TaskLogRepository taskLogRepository;
    private final TaskAuditRepository taskAuditRepository;
    private final TaskFavoriteRepository taskFavoriteRepository;

    // Create
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Create with logging
    @Transactional
    public Task createTaskWithLogging(TaskCreationRequest req) {
        Sprint sprint = sprintRepository.findById(req.sprintId())
                .orElseThrow(() -> new RuntimeException("Sprint not found"));
        AppUser creator = appUserRepository.findById(req.createdBy())
                .orElseThrow(() -> new RuntimeException("Creator not found"));
        AppUser assignee = appUserRepository.findById(req.assignedTo())
                .orElseThrow(() -> new RuntimeException("Assignee not found"));

        Task task = new Task();
        task.setTaskName(req.taskName());
        task.setTaskDescription(req.taskDescription());
        task.setPriority(req.taskPriority());
        task.setStatus(req.taskStatus());
        task.setType(req.taskType());
        task.setStoryPoints(req.storyPoints());
        task.setDueDate(req.dueDate());
        task.setSprint(sprint);
        task.setCreatedBy(creator);
        task.setAssignedTo(assignee);
        task.setCreatedAt(LocalDateTime.now());

        Task savedTask = taskRepository.save(task);

        // Initial TaskLog (0 hours)
        TaskLog log = new TaskLog();
        log.setTask(savedTask);
        log.setUser(creator);
        log.setHoursLogged(0.0);
        log.setLogDate(LocalDateTime.now());
        taskLogRepository.save(log);

        // TaskAudit for CREATE
        TaskAudit audit = new TaskAudit();
        audit.setTask(savedTask);
        audit.setChangedBy(creator);
        audit.setChangeType(ChangeType.CREATE);
        audit.setChangedAt(LocalDateTime.now());
        taskAuditRepository.save(audit);

        // TaskFavorite
        if (req.isFavorite()) {
            TaskFavorite favorite = new TaskFavorite();
            favorite.setTask(savedTask);
            favorite.setUser(creator);
            taskFavoriteRepository.save(favorite);
        }

        return savedTask;
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

    public List<TaskDto> getTasksAssignedToUser(Long userId) {
        return taskRepository.findAllByAssignedToIdAndIsActive(userId, true)
                .stream()
                .map(task -> {
                    boolean isFavorite = taskFavoriteRepository.existsByTaskIdAndUserId(task.getId(), userId);
                    return TaskMapper.toDto(task, isFavorite);
                })
                .toList();
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

        AppUser user = appUserRepository.findById(userId)
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

    // toggle favorite status
    public void toggleFavorite(Long userId, Long taskId, boolean favorite) {
        Optional<TaskFavorite> existing = taskFavoriteRepository.findByUserIdAndTaskId(userId, taskId);

        if (favorite) {
            if (existing.isEmpty()) {
                AppUser user = appUserRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                Task task = taskRepository.findById(taskId)
                        .orElseThrow(() -> new RuntimeException("Task not found"));
                TaskFavorite fav = new TaskFavorite(null, user, task, LocalDateTime.now());
                taskFavoriteRepository.save(fav);
            }
        } else {
            existing.ifPresent(taskFavoriteRepository::delete);
        }
    }

    public boolean isFavorite(Long userId, Long taskId) {
        return taskFavoriteRepository.findByUserIdAndTaskId(userId, taskId).isPresent();
    }
}
