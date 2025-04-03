package com.alexeiddg.web.controller.web;

import com.alexeiddg.web.model.TaskMetric;
import com.alexeiddg.web.service.interfaces.TaskMetricService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/metrics")
public class TaskMetricController {

    private final TaskMetricService taskMetricService;

    public TaskMetricController(TaskMetricService taskMetricService) {
        this.taskMetricService = taskMetricService;
    }

    // Get Task Metric by ID
    @GetMapping("/{id}")
    public ResponseEntity<TaskMetric> getMetricById(@PathVariable Long id) {
        Optional<TaskMetric> metric = taskMetricService.getMetricById(id);
        return metric.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Save Task Metric
    @PostMapping
    public ResponseEntity<TaskMetric> saveTaskMetric(@RequestBody TaskMetric taskMetric) {
        TaskMetric savedMetric = taskMetricService.saveTaskMetric(taskMetric);
        return ResponseEntity.ok(savedMetric);
    }

    // Delete Task Metric by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMetric(@PathVariable Long id) {
        taskMetricService.deleteMetric(id);
        return ResponseEntity.noContent().build();
    }

    // Calculate Developer Sprint Completion Rate
    @GetMapping("/developer/{developerId}/sprint/{sprintId}/completion-rate")
    public ResponseEntity<Float> getDeveloperSprintCompletionRate(@PathVariable Long developerId, @PathVariable Long sprintId) {
        float rate = taskMetricService.calculateSprintCompletionRateByDeveloper(developerId, sprintId);
        return ResponseEntity.ok(rate);
    }

    // Calculate Developer Efficiency Score
    @GetMapping("/developer/{developerId}/efficiency-score")
    public ResponseEntity<Float> getDeveloperEfficiencyScore(@PathVariable Long developerId) {
        float score = taskMetricService.calculateEfficiencyScoreByDeveloper(developerId);
        return ResponseEntity.ok(score);
    }

    // Calculate Team Sprint Completion Rate
    @GetMapping("/team/{teamId}/sprint/{sprintId}/completion-rate")
    public ResponseEntity<Float> getTeamSprintCompletionRate(@PathVariable Long teamId, @PathVariable Long sprintId) {
        float rate = taskMetricService.calculateSprintCompletionRateByTeam(teamId, sprintId);
        return ResponseEntity.ok(rate);
    }

    // Calculate Team Efficiency Score
    @GetMapping("/team/{teamId}/efficiency-score")
    public ResponseEntity<Float> getTeamEfficiencyScore(@PathVariable Long teamId) {
        float score = taskMetricService.calculateEfficiencyScoreByTeam(teamId);
        return ResponseEntity.ok(score);
    }

    // Calculate Project Sprint Completion Rate
    @GetMapping("/project/{projectId}/completion-rate")
    public ResponseEntity<Float> getProjectCompletionRate(@PathVariable Long projectId) {
        float rate = taskMetricService.calculateSprintCompletionRateByProject(projectId);
        return ResponseEntity.ok(rate);
    }

    // Calculate Project Efficiency Score
    @GetMapping("/project/{projectId}/efficiency-score")
    public ResponseEntity<Float> getProjectEfficiencyScore(@PathVariable Long projectId) {
        float score = taskMetricService.calculateEfficiencyScoreByProject(projectId);
        return ResponseEntity.ok(score);
    }
}