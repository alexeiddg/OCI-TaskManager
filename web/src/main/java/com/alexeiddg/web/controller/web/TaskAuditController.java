package com.alexeiddg.web.controller.web;

import com.alexeiddg.web.model.TaskAudit;
import com.alexeiddg.web.service.interfaces.TaskAuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/task-audit")
public class TaskAuditController {

    private final TaskAuditService taskAuditService;

    public TaskAuditController(TaskAuditService taskAuditService) {
        this.taskAuditService = taskAuditService;
    }

    // Get Task Audit by ID
    @GetMapping("/{auditId}")
    public ResponseEntity<TaskAudit> getAuditEntryById(@PathVariable Long auditId) {
        Optional<TaskAudit> auditEntry = taskAuditService.getAuditEntryById(auditId);
        return auditEntry.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Save a new Task Audit Entry
    @PostMapping
    public ResponseEntity<TaskAudit> saveAuditEntry(@RequestBody TaskAudit taskAudit) {
        TaskAudit savedAudit = taskAuditService.saveAuditEntry(taskAudit);
        return ResponseEntity.ok(savedAudit);
    }

    // Delete a Task Audit Entry by ID
    @DeleteMapping("/{auditId}")
    public ResponseEntity<Void> deleteAuditEntry(@PathVariable Long auditId) {
        taskAuditService.deleteAuditEntry(auditId);
        return ResponseEntity.noContent().build();
    }

    // Retrieve Audit Entries for a specific Task
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TaskAudit>> getAuditEntriesForTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskAuditService.getAuditEntriesForTask(taskId));
    }

    // Retrieve Audit Entries for a specific User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskAudit>> getAuditEntriesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(taskAuditService.getAuditEntriesByUser(userId));
    }

    // Retrieve Audit Entries by Change Type
    @GetMapping("/change-type/{changeType}")
    public ResponseEntity<List<TaskAudit>> getAuditEntriesByChangeType(@PathVariable String changeType) {
        return ResponseEntity.ok(taskAuditService.getAuditEntriesByChangeType(changeType));
    }

    // Retrieve Audit Entries within a Date Range
    @GetMapping("/date-range")
    public ResponseEntity<List<TaskAudit>> getAuditEntriesByDateRange(
            @RequestParam("start") OffsetDateTime startDate,
            @RequestParam("end") OffsetDateTime endDate) {
        return ResponseEntity.ok(taskAuditService.getAuditEntriesByDateRange(startDate, endDate));
    }

    // Retrieve Recent Task Changes (limited)
    @GetMapping("/recent")
    public ResponseEntity<List<TaskAudit>> getRecentChanges(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(taskAuditService.getRecentChanges(limit));
    }

    // Count Changes by Task
    @GetMapping("/count/task/{taskId}")
    public ResponseEntity<Long> countChangesByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskAuditService.countChangesByTask(taskId));
    }

    // Count Changes by User
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Long> countChangesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(taskAuditService.countChangesByUser(userId));
    }
}