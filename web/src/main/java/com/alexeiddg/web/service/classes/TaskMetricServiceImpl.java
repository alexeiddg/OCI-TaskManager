package com.alexeiddg.web.service.classes;

import com.alexeiddg.web.model.TaskMetric;
import com.alexeiddg.web.repository.TaskMetricRepository;
import com.alexeiddg.web.service.interfaces.TaskMetricService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TaskMetricServiceImpl implements TaskMetricService {

    private final TaskMetricRepository taskMetricRepository;

    public TaskMetricServiceImpl(TaskMetricRepository taskMetricRepository) {
        this.taskMetricRepository = taskMetricRepository;
    }

    @Override
    public Optional<TaskMetric> getMetricById(Long id) {
        return taskMetricRepository.findById(id);
    }

    @Override
    public TaskMetric saveTaskMetric(TaskMetric taskMetric) {
        return taskMetricRepository.save(taskMetric);
    }

    @Override
    public void deleteMetric(Long id) {
        taskMetricRepository.deleteById(id);
    }

    // Developer Performance
    @Override
    public float calculateSprintCompletionRateByDeveloper(Long developerId, Long sprintId) {
        int totalAssignedTasks = taskMetricRepository.getTotalAssignedTasksByDeveloper(developerId);
        if (totalAssignedTasks == 0) return 0.0f;

        int completedTasks = taskMetricRepository.getCompletedTasksByDeveloper(developerId);
        return (completedTasks / (float) totalAssignedTasks) * 100;
    }

    @Override
    public float calculateEfficiencyScoreByDeveloper(Long developerId) {
        int completedTasks = taskMetricRepository.getCompletedTasksByDeveloper(developerId);
        if (completedTasks == 0) return 0.0f;

        Long avgCompletionTime = taskMetricRepository.getAvgCompletionTimeByDeveloper(developerId);
        return avgCompletionTime == null || avgCompletionTime == 0 ? 0.0f : (completedTasks / (float) avgCompletionTime);
    }

    // Team Performance
    @Override
    public float calculateSprintCompletionRateByTeam(Long teamId, Long sprintId) {
        int totalAssignedTasks = taskMetricRepository.getTotalAssignedTasksByTeam(teamId);
        if (totalAssignedTasks == 0) return 0.0f;

        int completedTasks = taskMetricRepository.getCompletedTasksByTeam(teamId);
        return (completedTasks / (float) totalAssignedTasks) * 100;
    }

    @Override
    public float calculateEfficiencyScoreByTeam(Long teamId) {
        int completedTasks = taskMetricRepository.getCompletedTasksByTeam(teamId);
        if (completedTasks == 0) return 0.0f;

        Long avgCompletionTime = taskMetricRepository.getAvgCompletionTimeByTeam(teamId);
        return avgCompletionTime == null || avgCompletionTime == 0 ? 0.0f : (completedTasks / (float) avgCompletionTime);
    }

    // Project Performance
    @Override
    public float calculateSprintCompletionRateByProject(Long projectId) {
        int totalAssignedTasks = taskMetricRepository.getTotalAssignedTasksByProject(projectId);
        if (totalAssignedTasks == 0) return 0.0f;

        int completedTasks = taskMetricRepository.getCompletedTasksByProject(projectId);
        return (completedTasks / (float) totalAssignedTasks) * 100;
    }

    @Override
    public float calculateEfficiencyScoreByProject(Long projectId) {
        int completedTasks = taskMetricRepository.getCompletedTasksByProject(projectId);
        if (completedTasks == 0) return 0.0f;

        Long avgCompletionTime = taskMetricRepository.getAvgCompletionTimeByTeam(projectId); // Assuming team avg is relevant
        return avgCompletionTime == null || avgCompletionTime == 0 ? 0.0f : (completedTasks / (float) avgCompletionTime);
    }
}
