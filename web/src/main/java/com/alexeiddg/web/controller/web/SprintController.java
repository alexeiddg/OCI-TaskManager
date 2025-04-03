package com.alexeiddg.web.controller.web;

import com.alexeiddg.web.model.Sprint;
import com.alexeiddg.web.model.Task;
import com.alexeiddg.web.service.interfaces.SprintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/sprint")
public class SprintController {
    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    // Get a sprint by ID
    @GetMapping("/{sprintId}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable Long sprintId) {
        Optional<Sprint> sprint = sprintService.getSprintById(sprintId);
        return sprint.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new sprint
    @PostMapping
    public ResponseEntity<Sprint> createSprint(@RequestBody Sprint sprint) {
        return ResponseEntity.ok(sprintService.saveSprint(sprint));
    }

    // Delete a sprint
    @DeleteMapping("/{sprintId}")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long sprintId) {
        sprintService.deleteSprint(sprintId);
        return ResponseEntity.noContent().build();
    }

    // Start a sprint
    @PostMapping("/{sprintId}/start")
    public ResponseEntity<Sprint> startSprint(@PathVariable Long sprintId) {
        return ResponseEntity.ok(sprintService.startSprint(sprintId));
    }

    // Complete a sprint
    @PostMapping("/{sprintId}/complete")
    public ResponseEntity<Sprint> completeSprint(@PathVariable Long sprintId) {
        return ResponseEntity.ok(sprintService.completeSprint(sprintId));
    }

    // Update sprint details
    @PutMapping("/{sprintId}")
    public ResponseEntity<Sprint> updateSprint(@PathVariable Long sprintId, @RequestBody Sprint updatedSprint) {
        return ResponseEntity.ok(sprintService.updateSprintDetails(sprintId, updatedSprint));
    }

    // Get all sprints
    @GetMapping
    public ResponseEntity<List<Sprint>> getAllSprints() {
        return ResponseEntity.ok(sprintService.getAllSprints());
    }

    // Get sprints for a specific project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Sprint>> getSprintsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(sprintService.getSprintsByProject(projectId));
    }

    // Get tasks assigned to a sprint
    @GetMapping("/{sprintId}/tasks")
    public ResponseEntity<List<Task>> getTasksBySprint(@PathVariable Long sprintId) {
        return ResponseEntity.ok(sprintService.getTasksBySprint(sprintId));
    }

    // Calculate sprint velocity
    @GetMapping("/{sprintId}/velocity")
    public ResponseEntity<Float> getSprintVelocity(@PathVariable Long sprintId) {
        return ResponseEntity.ok(sprintService.calculateSprintVelocity(sprintId));
    }

    // Calculate completion rate
    @GetMapping("/{sprintId}/completion-rate")
    public ResponseEntity<Float> getSprintCompletionRate(@PathVariable Long sprintId) {
        return ResponseEntity.ok(sprintService.calculateCompletionRate(sprintId));
    }
}