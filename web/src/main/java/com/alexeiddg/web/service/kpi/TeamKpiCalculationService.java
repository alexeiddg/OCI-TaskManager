package com.alexeiddg.web.service.kpi;

import DTO.domian.kpi.TeamProgressForecast;
import DTO.domian.kpi.TeamTaskTypeBreakdown;
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

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamKpiCalculationService {

    private final TaskRepository taskRepo;
    private final TaskLogRepository logRepo;
    private final KpiCalculationService kpiCalculationService;

    /**
     * 1. 📈 Team Sprint Velocity
     */
    public int sprintVelocity(Sprint sprint) {
        return sprint.getTasks().stream()
                .filter(t -> t.getCompletedAt() != null && Boolean.TRUE.equals(t.getIsActive()))
                .mapToInt(Task::getStoryPoints)
                .sum();
    }

    /**
     * 2. ✅ Team Completion Rate
     */
    public double completionRate(Sprint sprint) {
        long active = sprint.getTasks().stream().filter(Task::getIsActive).count();
        long complete = sprint.getTasks().stream().filter(Task::getIsActive).filter(Task::isCompleted).count();
        return active == 0 ? 0 : (double) complete / active;
    }

    /**
     * 3. ⚙️ Average Efficiency Score = mean(SP/hour) for each member
     */
    public double averageEfficiency(Sprint sprint) {
        List<AppUser> members = sprint.getProject().getTeam().getMembers();
        if (members.isEmpty()) return 0;

        return members.stream()
                .mapToDouble(u -> kpiCalculationService.calculateEfficiency(u, sprint))
                .average()
                .orElse(0);
    }

    /**
     * 4. ⏱️ Avg Completion Time
     */
    public double averageCompletionTime(Sprint sprint) {
        return sprint.getTasks().stream()
                .filter(t -> t.getCompletedAt() != null && t.getCreatedAt() != null && t.getIsActive())
                .mapToDouble(t -> Duration.between(t.getCreatedAt(), t.getCompletedAt()).toHours())
                .average().orElse(0);
    }

    /**
     * 5. 🪲 Team Bug:Feature Ratio
     */
    public double bugFeatureRatio(Sprint sprint) {
        var active = sprint.getTasks().stream().filter(Task::getIsActive).toList();
        long bugs = active.stream().filter(Task::isBug).count();
        long feats = active.stream().filter(Task::isFeature).count();
        return feats == 0 ? bugs : (double)bugs/feats;
    }

    /**
     * 6. 📦 Workload Balance Score (variance of SP per member)
     */
    public double workloadBalance(Sprint sprint) {
        List<AppUser> members = sprint.getProject().getTeam().getMembers();
        List<Double> loads = members.stream()
                .map(m -> sprint.getTasks().stream()
                        .filter(t -> m.equals(t.getAssignedTo()) && t.getIsActive())
                        .mapToDouble(Task::getStoryPoints).sum())
                .toList();

        double avg = loads.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double variance = loads.stream()
                .mapToDouble(l -> Math.pow(l - avg, 2)).average().orElse(0);

        return avg == 0 ? 1 : 1 - Math.sqrt(variance) / avg;
    }

    /* ───────── Risk & Blockers ─────────────────────────────────── */

    public long blockedTasks(Sprint sprint) {
        return sprint.getTasks().stream().filter(Task::getIsActive).filter(Task::isBlocked).count();
    }

    public long highPriorityPending(Sprint sprint) {
        return sprint.getTasks().stream()
                .filter(Task::getIsActive)
                .filter(t -> t.getPriority() == TaskPriority.HIGH)
                .filter(t -> t.getStatus() == TaskStatus.TODO || t.getStatus() == TaskStatus.IN_PROGRESS)
                .count();
    }

    public long overdueTasks(Sprint sprint) {
        LocalDateTime now = LocalDateTime.now();
        return sprint.getTasks().stream()
                .filter(Task::getIsActive)
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(now))
                .filter(t -> t.getStatus() != TaskStatus.DONE)
                .count();
    }

    public boolean scopeAtRisk(Sprint sprint) {
        int remainingSP = sprint.getTasks().stream()
                .filter(Task::getIsActive)
                .filter(t -> !t.isCompleted())
                .mapToInt(Task::getStoryPoints).sum();

        double teamVelocityPerDay = sprintVelocity(sprint) /
                Math.max(1.0, Duration.between(sprint.getStartDate(), LocalDateTime.now()).toDays());

        long daysLeft = Math.max(1,
                Duration.between(LocalDateTime.now(), sprint.getEndDate()).toDays());

        return remainingSP > teamVelocityPerDay * daysLeft;
    }


    public double totalTimeLogged(Sprint sprint) {
        return logRepo.findBySprintIdAndHoursGreaterThan(sprint.getId(), 0)
                .stream()
                .mapToDouble(TaskLog::getHoursLogged)
                .sum();
    }

    public TeamTaskTypeBreakdown taskTypeBreakdown(Sprint sprint) {
        Map<TaskType, Long> counts = sprint.getTasks().stream()
                .filter(Task::getIsActive)
                .collect(Collectors.groupingBy(Task::getType, Collectors.counting()));

        return new TeamTaskTypeBreakdown(
                counts.getOrDefault(TaskType.BUG, 0L),
                counts.getOrDefault(TaskType.FEATURE, 0L),
                counts.getOrDefault(TaskType.IMPROVEMENT, 0L));
    }

    public TeamProgressForecast progressForecast(Sprint sprint) {
        long totalDays = Duration.between(sprint.getStartDate(), sprint.getEndDate()).toDays();
        long daysPassed = Duration.between(sprint.getStartDate(), LocalDateTime.now()).toDays();
        double timePct = totalDays == 0 ? 1 : (double) daysPassed / totalDays;

        double workPct = completionRate(sprint);

        return new TeamProgressForecast(timePct * 100, workPct * 100);
    }


    /**
     * 14. 🧠 Focus Score (team)
     */
    public double focusScore(Sprint sprint) {
        var completed = sprint.getTasks().stream()
                .filter(Task::getIsActive)
                .filter(Task::isCompleted)
                .toList();

        if (completed.isEmpty()) return 0;
        long features = completed.stream().filter(Task::isFeature).count();
        return (double) features / completed.size();
    }

    /**
     * 15. 🌟 Top Contributor(s) by velocity
     */
    public List<AppUser> topContributors(Sprint sprint) {
        Map<AppUser, Integer> byMember = sprint.getTasks().stream()
                .filter(Task::isCompleted)
                .collect(Collectors.groupingBy(Task::getAssignedTo,
                        Collectors.summingInt(Task::getStoryPoints)));
        int max = byMember.values().stream().mapToInt(v -> v).max().orElse(0);
        return byMember.entrySet().stream()
                .filter(e -> e.getValue() == max)
                .map(Map.Entry::getKey).toList();
    }
}
