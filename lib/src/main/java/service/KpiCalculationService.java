package service;

import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.Sprint;
import model.Task;
import org.springframework.stereotype.Service;
import repository.TaskLogRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KpiCalculationService {

    private final TaskLogRepository taskLogRepository;

    public double calculateSprintCompletionRate(Sprint sprint) {
        List<Task> tasks = sprint.getTasks();
        if (tasks == null || tasks.isEmpty()) return 0;

        long done = tasks.stream().filter(t -> t != null && t.isCompleted()).count();
        return (double) done / tasks.size();
    }

    public double calculateSprintVelocity(Sprint sprint) {
        List<Task> tasks = sprint.getTasks();
        if (tasks == null || tasks.isEmpty()) return 0;

        return tasks.stream()
                .filter(t -> t != null && t.isCompleted())
                .mapToInt(Task::getStoryPoints)
                .sum();
    }

    public double calculateBugsVsFeatures(Sprint sprint) {
        List<Task> tasks = sprint.getTasks();
        if (tasks == null || tasks.isEmpty()) return 0;

        long bugs = tasks.stream().filter(t -> t != null && t.isBug()).count();
        long features = tasks.stream().filter(t -> t != null && t.isFeature()).count();
        return features == 0 ? bugs : (double) bugs / features;
    }

    public double calculateAverageCompletionTime(Sprint sprint) {
        List<Task> tasks = sprint.getTasks();
        if (tasks == null || tasks.isEmpty()) return 0;

        return tasks.stream()
                .filter(t -> t != null && t.getCompletedAt() != null && t.getCreatedAt() != null)
                .mapToDouble(t -> java.time.Duration.between(t.getCreatedAt(), t.getCompletedAt()).toHours())
                .average()
                .orElse(0);
    }

    public double calculateEfficiency(AppUser user, Sprint sprint) {
        List<Task> tasks = sprint.getTasks();
        if (tasks == null || user == null) return 0;

        List<Task> userTasks = tasks.stream()
                .filter(t -> t != null && user.equals(t.getAssignedTo()) && t.isCompleted())
                .toList();

        double totalEstimated = userTasks.stream().mapToDouble(Task::getStoryPoints).sum();
        double totalLogged = taskLogRepository.sumHoursByUserAndSprint(user, sprint.getId());

        return totalLogged == 0 ? 0 : totalEstimated / totalLogged;
    }

    public double calculateWorkloadBalance(Sprint sprint) {
        if (sprint.getProject() == null || sprint.getProject().getTeam() == null) return 1;

        List<AppUser> users = sprint.getProject().getTeam().getMembers();
        List<Task> tasks = sprint.getTasks();
        if (users == null || users.isEmpty() || tasks == null) return 1;

        List<Double> taskCounts = users.stream()
                .map(user -> (double) tasks.stream()
                        .filter(t -> t != null && user.equals(t.getAssignedTo()))
                        .count())
                .toList();

        double avg = taskCounts.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double variance = taskCounts.stream().mapToDouble(c -> Math.pow(c - avg, 2)).average().orElse(0);

        return avg == 0 ? 1 : 1 - (Math.sqrt(variance) / avg);
    }
}