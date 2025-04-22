package com.alexeiddg.web.service.kpi;

import DTO.domian.kpi.ProgressForecast;
import DTO.domian.kpi.TaskTypeBreakdown;
import enums.TaskPriority;
import enums.TaskStatus;
import enums.TaskType;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Sprint;
import model.Task;
import model.TaskLog;
import org.springframework.stereotype.Service;
import repository.TaskLogRepository;
import repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KpiCalculationService {

    private final TaskLogRepository taskLogRepository;
    private final TaskRepository taskRepository;

    public double calculateSprintCompletionRate(Sprint sprint) {
        List<Task> active = sprint.getTasks()
                .stream()
                .filter(t -> t != null && Boolean.TRUE.equals(t.getIsActive()))
                .toList();
        if (active.isEmpty()) return 0;

        long done = active
                .stream()
                .filter(t -> t.getCompletedAt() != null)
                .count();
        return (double) done / active.size();
    }

    public double calculateSprintVelocity(Sprint sprint) {
        return sprint.getTasks().stream()
                .filter(t -> t != null
                        && Boolean.TRUE.equals(t.getIsActive())
                        && t.getCompletedAt() != null)
                .mapToInt(Task::getStoryPoints)
                .sum();
    }

    public double calculateBugsVsFeatures(Sprint sprint) {
        var active = sprint.getTasks().stream()
                .filter(t -> t != null && Boolean.TRUE.equals(t.getIsActive()))
                .toList();
        if (active.isEmpty()) return 0;

        long bugs = active.stream().filter(Task::isBug).count();
        long features = active.stream().filter(Task::isFeature).count();
        return features == 0 ? bugs : (double) bugs / features;
    }

    public double calculateAverageCompletionTime(Sprint sprint) {
        return sprint.getTasks().stream()
                .filter(t -> t != null
                        && Boolean.TRUE.equals(t.getIsActive())
                        && t.getCreatedAt() != null
                        && t.getCompletedAt() != null)
                .mapToDouble(t ->
                        java.time.Duration.between(t.getCreatedAt(), t.getCompletedAt())
                                .toHours())
                .average()
                .orElse(0);
    }


    public double calculateAverageLoggedHours(AppUser user, Sprint sprint) {
        List<TaskLog> logs = taskLogRepository
                .findPositiveLogsByUserAndSprint(user, sprint.getId());

        if (logs.isEmpty()) return 0;

        var hoursPerTask = logs.stream()
                .collect(Collectors.groupingBy(
                        tl -> tl.getTask().getId(),
                        Collectors.summingDouble(TaskLog::getHoursLogged)));

        return hoursPerTask.values().stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0);
    }


    public double calculateEfficiency(AppUser user, Sprint sprint) {
        List<Task> completed = sprint.getTasks().stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive())
                        && t.getAssignedTo() != null
                        && user.getId().equals(t.getAssignedTo().getId())
                        && t.getCompletedAt() != null)
                .toList();

        int totalSP = completed.stream()
                .mapToInt(Task::getStoryPoints)
                .sum();

        double totalHours = completed.stream()
                .mapToDouble(t ->
                        taskLogRepository.sumHoursByTaskAndUser(t.getId(), user.getId()))
                .sum();

        return totalHours == 0 ? 0 : totalSP / totalHours;
    }

    public double calculateWorkloadBalance(Sprint sprint) {
        var active = sprint.getTasks().stream()
                .filter(t -> t != null && Boolean.TRUE.equals(t.getIsActive()))
                .toList();

        if (active.isEmpty() || sprint.getProject() == null
                || sprint.getProject().getTeam() == null) return 1;

        List<AppUser> users = sprint.getProject().getTeam().getMembers();
        // count tasks per user
        List<Double> counts = users.stream()
                .map(u -> (double) active.stream()
                        .filter(t -> u.equals(t.getAssignedTo()))
                        .count())
                .toList();

        double avg = counts.stream().mapToDouble(d -> d).average().orElse(0);
        double variance = counts.stream()
                .mapToDouble(c -> Math.pow(c - avg, 2))
                .average()
                .orElse(0);
        return avg == 0 ? 1 : 1 - (Math.sqrt(variance) / avg);
    }

    public double calculateEstimateAccuracy(AppUser user, Sprint sprint) {
        List<Task> completed = sprint.getTasks().stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive())
                        && t.getAssignedTo() != null
                        && user.getId().equals(t.getAssignedTo().getId())
                        && t.getCompletedAt() != null)
                .toList();

        int estimatedSP = completed.stream()
                .mapToInt(Task::getStoryPoints)
                .sum();

        double actualHours = completed.stream()
                .mapToDouble(t ->
                        taskLogRepository.sumHoursByTaskAndUser(t.getId(), user.getId()))
                .sum();

        return actualHours == 0 ? 0 : estimatedSP / actualHours;
    }

    public double estimateErrorPct(AppUser user, Sprint sprint) {
        double estimated = sprint.getTasks().stream()
                .filter(t -> isActiveAndAssignedTo(user, t))
                .mapToDouble(t -> Math.min(t.getStoryPoints(), 4))
                .sum();

        double actual = taskLogRepository.sumHoursByUserAndSprint(user.getId(), sprint.getId());
        return actual == 0.0 ? 0.0 : Math.abs(estimated - actual) / actual * 100;
    }

    private boolean isActiveAndAssignedTo(AppUser user, Task t) {
        return Boolean.TRUE.equals(t.getIsActive())
                && t.getAssignedTo() != null
                && t.getAssignedTo().getId().equals(user.getId());
    }

    public long countBlockedTasks(AppUser user) {
        return taskRepository.findAllByBlockedTrueAndAssignedToId(user.getId()).size();
    }

    public long countHighPriorityPending(AppUser user) {
        return taskRepository.findAllByAssignedToIdAndIsActive(user.getId(), true).stream()
                .filter(t -> t.getPriority() == TaskPriority.HIGH &&
                        (t.getStatus() == TaskStatus.TODO || t.getStatus() == TaskStatus.IN_PROGRESS))
                .count();
    }

    public long countOverdueTasks(AppUser user) {
        return taskRepository
                .findAllByDueDateBeforeAndAssignedToId(LocalDateTime.now(), user.getId())
                .stream()
                .filter(Task::getIsActive)
                .filter(t -> t.getStatus() != TaskStatus.DONE)
                .count();
    }


    public boolean isSprintScopeAtRisk(AppUser user, Sprint sprint) {
        int remainingSP = sprint.getTasks().stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive())
                        && t.getAssignedTo() != null
                        && user.getId().equals(t.getAssignedTo().getId())
                        && t.getCompletedAt() == null)
                .mapToInt(Task::getStoryPoints)
                .sum();

        List<Task> completed = sprint.getTasks().stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive())
                        && t.getAssignedTo() != null
                        && user.getId().equals(t.getAssignedTo().getId())
                        && t.getCompletedAt() != null
                        && t.getCreatedAt() != null)
                .toList();

        double spPerDay = completed.stream()
                .mapToDouble(t -> t.getStoryPoints() /
                        (double) java.time.Duration.between(t.getCreatedAt(), t.getCompletedAt()).toDays())
                .average()
                .orElse(0.5);

        long daysLeft = java.time.Duration.between(LocalDateTime.now(), sprint.getEndDate()).toDays();
        double capacityLeft = spPerDay * daysLeft;
        return remainingSP > capacityLeft;
    }

    public TaskTypeBreakdown getTaskTypeBreakdown(AppUser user, Sprint sprint) {
        List<Task> assigned = sprint.getTasks().stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive())
                        && t.getAssignedTo() != null
                        && user.getId().equals(t.getAssignedTo().getId()))
                .toList();

        long bugs = assigned.stream().filter(t -> t.getType() == TaskType.BUG).count();
        long features = assigned.stream().filter(t -> t.getType() == TaskType.FEATURE).count();
        long improvements = assigned.stream().filter(t -> t.getType() == TaskType.IMPROVEMENT).count();

        return new TaskTypeBreakdown(bugs, features, improvements);
    }

    public ProgressForecast getProgressForecast(AppUser user, Sprint sprint) {
        LocalDateTime now = LocalDateTime.now();
        long totalDays = java.time.Duration.between(sprint.getStartDate(), sprint.getEndDate()).toDays();
        long daysPassed = java.time.Duration.between(sprint.getStartDate(), now).toDays();

        double timePct = totalDays == 0 ? 1.0 : Math.min((double) daysPassed / totalDays, 1.0);

        List<Task> assigned = sprint.getTasks().stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive())
                        && t.getAssignedTo() != null
                        && user.getId().equals(t.getAssignedTo().getId()))
                .toList();

        long completed = assigned.stream().filter(Task::isCompleted).count();
        double workPct = assigned.isEmpty() ? 0 : (double) completed / assigned.size();

        return new ProgressForecast(timePct * 100, workPct * 100);
    }

    public double calculateFocusScore(AppUser user, Sprint sprint) {
        List<Task> completed = sprint.getTasks().stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive()))
                .filter(t -> user.getId().equals(t.getAssignedTo().getId()))
                .filter(t -> t.getCompletedAt() != null)
                .toList();

        if (completed.isEmpty()) return 0;

        long featureCount = completed.stream()
                .filter(t -> t.getType() == TaskType.FEATURE)
                .count();

        return (double) featureCount / completed.size();
    }

    // TODO: 15.🔄 Task Churn
    //	• Number of tasks reassigned or reopened.Could indicate instability or misestimation.
}