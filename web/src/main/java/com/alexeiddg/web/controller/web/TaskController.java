package com.alexeiddg.web.controller.web;

import com.alexeiddg.web.model.Task;
import com.alexeiddg.web.service.interfaces.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/task")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Get task by ID
    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long taskId) {
        Optional<Task> task = taskService.getTaskById(taskId);
        return task.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create or update a task
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task savedTask = taskService.saveTask(task);
        return ResponseEntity.ok(savedTask);
    }

    // Delete a task
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    // Assign task to a user
    @PutMapping("/{taskId}/assign/{userId}")
    public ResponseEntity<Task> assignTaskToUser(@PathVariable Long taskId, @PathVariable Long userId) {
        Task task = taskService.assignTaskToUser(taskId, userId);
        return ResponseEntity.ok(task);
    }

    // Update task status
    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId, @RequestParam String status) {
        Task task = taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok(task);
    }

    // Set task as blocked/unblocked
    @PutMapping("/{taskId}/block")
    public ResponseEntity<Task> setTaskBlocked(@PathVariable Long taskId, @RequestParam boolean blocked) {
        Task task = taskService.setTaskBlocked(taskId, blocked);
        return ResponseEntity.ok(task);
    }

    // Get tasks assigned to a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByAssignedUser(@PathVariable Long userId) {
        List<Task> tasks = taskService.getTasksByAssignedUser(userId);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by team
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Task>> getTasksByTeam(@PathVariable Long teamId) {
        List<Task> tasks = taskService.getTasksByTeam(teamId);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by sprint
    @GetMapping("/sprint/{sprintId}")
    public ResponseEntity<List<Task>> getTasksBySprint(@PathVariable Long sprintId) {
        List<Task> tasks = taskService.getTasksBySprint(sprintId);
        return ResponseEntity.ok(tasks);
    }

    // Get tasks by project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }
}