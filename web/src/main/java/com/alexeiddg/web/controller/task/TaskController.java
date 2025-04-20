package com.alexeiddg.web.controller.task;

import DTO.domian.TaskDto;
import DTO.domian.mappers.TaskMapper;
import DTO.helpers.TaskFavoriteRequest;
import DTO.setup.TaskCreationRequest;
import com.alexeiddg.web.service.TaskService;
import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;
import model.Task;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v2/task")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Create a new task using logging
    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskCreationRequest request) {
        Task createdTask = taskService.createTaskWithLogging(request);
        return ResponseEntity.ok(TaskMapper.toDto(createdTask, false));
    }

    // Update an existing task
    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long taskId,
            @RequestBody Task task
    ) {
        task.setId(taskId);
        Task updated = taskService.updateTask(task);
        return ResponseEntity.ok(updated);
    }

     // Delete Task (hard delete)
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable("taskId") Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    // Soft delete task
    @PatchMapping("/{taskId}/soft-delete")
    public ResponseEntity<Void> softDeleteTask(@PathVariable("taskId") Long taskId) {
        taskService.softDeleteTask(taskId);
        return ResponseEntity.ok().build();
    }

    // Get tasks assigned to a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDto>> getTasksAssignedToUser(@PathVariable("userId") Long userId) {
        List<TaskDto> tasks = taskService.getTasksAssignedToUser(userId);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by sprint
    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<List<Task>> getTasksBySprint(@PathVariable Long sprintId) {
        List<Task> tasks = taskService.getTasksBySprint(sprintId);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by user and sprint
    @GetMapping("/user/{userId}/sprint/{sprintId}")
    public ResponseEntity<List<Task>> getTasksByUserAndSprint(
            @PathVariable Long userId,
            @PathVariable Long sprintId
    ) {
        List<Task> tasks = taskService.getTasksByUserAndSprint(userId, sprintId);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks created by user
    @GetMapping("/created-by/{userId}")
    public ResponseEntity<List<Task>> getTasksCreatedByUser(@PathVariable Long userId) {
        List<Task> tasks = taskService.getTasksCreatedByUser(userId);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by status for user
    @GetMapping("/user/{userId}/status")
    public ResponseEntity<List<Task>> getTasksByStatusForUser(
            @PathVariable Long userId,
            @RequestParam TaskStatus status
    ) {
        List<Task> tasks = taskService.getTasksByStatusForUser(status, userId);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by type for user
    @GetMapping("/user/{userId}/type")
    public ResponseEntity<List<Task>> getTasksByTypeForUser(
            @PathVariable Long userId,
            @RequestParam TaskType type
    ) {
        List<Task> tasks = taskService.getTasksByTypeForUser(type, userId);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by priority for user
    @GetMapping("/user/{userId}/priority")
    public ResponseEntity<List<Task>> getTasksByPriorityForUser(
            @PathVariable Long userId,
            @RequestParam TaskPriority priority
    ) {
        List<Task> tasks = taskService.getTasksByPriorityForUser(priority, userId);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks due before date for user
    @GetMapping("/user/{userId}/due-before")
    public ResponseEntity<List<Task>> getTasksDueBeforeForUser(
            @PathVariable Long userId,
            @RequestParam("dateTime") String dateTimeString
    ) {
        // Expecting an ISO-8601 string like "2025-04-06T10:15:30" in query param
        LocalDateTime dateTime = LocalDateTime.parse(dateTimeString);
        List<Task> tasks = taskService.getTasksDueBeforeForUser(dateTime, userId);
        return ResponseEntity.ok(tasks);
    }


    // Get tasks by minimum story points for user
    @GetMapping("/user/{userId}/story-points")
    public ResponseEntity<List<Task>> getTasksByMinStoryPointsForUser(
            @PathVariable Long userId,
            @RequestParam int points
    ) {
        List<Task> tasks = taskService.getTasksByMinStoryPointsForUser(points, userId);
        return ResponseEntity.ok(tasks);
    }

    // Get blocked tasks for user
    @GetMapping("/user/{userId}/blocked")
    public ResponseEntity<List<Task>> getBlockedTasksByUser(@PathVariable Long userId) {
        List<Task> tasks = taskService.getBlockedTasksByUser(userId);
        return ResponseEntity.ok(tasks);
    }

    // Get completed tasks for user
    public ResponseEntity<List<Task>> getCompletedTasksForUser(@PathVariable Long userId) {
        List<Task> tasks = taskService.getCompletedTasksForUser(userId);
        return ResponseEntity.ok(tasks);
    }

    // Assign user to a task
    @PatchMapping("/{taskId}/assign/{userId}")
    public ResponseEntity<Void> assignUserToTask(
            @PathVariable Long taskId,
            @PathVariable Long userId
    ) {
        taskService.assignUserToTask(taskId, userId);
        return ResponseEntity.ok().build();
    }

    // Mark task as completed
    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<Void> markTaskAsCompleted(@PathVariable("taskId") Long taskId) {
        taskService.markTaskAsCompleted(taskId);
        return ResponseEntity.ok().build();
    }

    // Toggle blocked status
    @PatchMapping("/{taskId}/block")
    public ResponseEntity<Void> toggleBlocked(
            @PathVariable Long taskId,
            @RequestParam boolean blocked
    ) {
        taskService.toggleBlocked(taskId, blocked);
        return ResponseEntity.ok().build();
    }

    // Get overdue tasks for user
    @GetMapping("/user/{userId}/overdue")
    public ResponseEntity<List<Task>> getOverdueTasksForUser(@PathVariable Long userId) {
        List<Task> tasks = taskService.getOverdueTasksForUser(userId);
        return ResponseEntity.ok(tasks);
    }


    @PostMapping("/toggle-favorite")
    public ResponseEntity<Void> toggleFavorite(@RequestBody TaskFavoriteRequest request) {
        taskService.toggleFavorite(request.userId(), request.taskId(), request.favorite());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/is-favorite")
    public ResponseEntity<Boolean> isFavorite(
            @RequestParam("userId") Long userId,
            @RequestParam("taskId") Long taskId) {
        boolean favorite = taskService.isFavorite(userId, taskId);
        return ResponseEntity.ok(favorite);
    }
}
