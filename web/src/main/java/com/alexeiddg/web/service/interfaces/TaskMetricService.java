package com.alexeiddg.web.service.interfaces;

import com.alexeiddg.web.model.TaskMetric;

import java.util.Optional;

public interface TaskMetricService {
    Optional<TaskMetric> getMetricById(Long id);
    TaskMetric saveTaskMetric(TaskMetric taskMetric);
    void deleteMetric(Long id);

    // Developer Performance
    float calculateSprintCompletionRateByDeveloper(Long developerId, Long sprintId);
    float calculateEfficiencyScoreByDeveloper(Long developerId);

    // Team Performance
    float calculateSprintCompletionRateByTeam(Long teamId, Long sprintId);
    float calculateEfficiencyScoreByTeam(Long teamId);

    // Project & Sprint Performance
    float calculateSprintCompletionRateByProject(Long projectId);
    float calculateEfficiencyScoreByProject(Long projectId);
}
