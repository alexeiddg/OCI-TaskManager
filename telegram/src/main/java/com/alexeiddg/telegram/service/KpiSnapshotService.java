package com.alexeiddg.telegram.service;

import enums.KpiType;
import lombok.RequiredArgsConstructor;
import model.*;
import org.springframework.stereotype.Service;
import repository.KpiSnapshotRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KpiSnapshotService {
    private final KpiSnapshotRepository snapshotRepo;
    private final KpiCalculationService kpiCalc;

    public void snapshotForSprint(Sprint sprint) {
        Team team = sprint.getProject().getTeam();
        List<KpiSnapshot> snapshots = new ArrayList<>();

        // Team-wide metrics
        snapshots.add(createSnapshot(KpiType.SPRINT_COMPLETION_RATE, kpiCalc.calculateSprintCompletionRate(sprint), sprint, team, null));
        snapshots.add(createSnapshot(KpiType.SPRINT_VELOCITY, kpiCalc.calculateSprintVelocity(sprint), sprint, team, null));
        snapshots.add(createSnapshot(KpiType.BUGS_VS_FEATURES_RATIO, kpiCalc.calculateBugsVsFeatures(sprint), sprint, team, null));
        snapshots.add(createSnapshot(KpiType.AVERAGE_COMPLETION_TIME, kpiCalc.calculateAverageCompletionTime(sprint), sprint, team, null));
        snapshots.add(createSnapshot(KpiType.WORKLOAD_BALANCE, kpiCalc.calculateWorkloadBalance(sprint), sprint, team, null));

        // By-user metrics
        for (AppUser user : team.getMembers()) {
            double efficiency = kpiCalc.calculateEfficiency(user, sprint);
            snapshots.add(createSnapshot(KpiType.EFFICIENCY_SCORE, efficiency, sprint, team, user));

            double velocity = sprint.getTasks().stream()
                    .filter(t -> user.equals(t.getAssignedTo()) && t.isCompleted())
                    .mapToInt(Task::getStoryPoints)
                    .sum();
            snapshots.add(createSnapshot(KpiType.SPRINT_VELOCITY, velocity, sprint, team, user));

            long completed = sprint.getTasks().stream()
                    .filter(t -> user.equals(t.getAssignedTo()) && t.isCompleted())
                    .count();
            long total = sprint.getTasks().stream()
                    .filter(t -> user.equals(t.getAssignedTo()))
                    .count();
            double completionRate = total == 0 ? 0 : (double) completed / total;
            snapshots.add(createSnapshot(KpiType.SPRINT_COMPLETION_RATE, completionRate, sprint, team, user));

            double avgTime = sprint.getTasks().stream()
                    .filter(t -> user.equals(t.getAssignedTo()) && t.isCompleted()
                            && t.getCreatedAt() != null && t.getCompletedAt() != null)
                    .mapToDouble(t -> java.time.Duration.between(t.getCreatedAt(), t.getCompletedAt()).toHours())
                    .average().orElse(0);
            snapshots.add(createSnapshot(KpiType.AVERAGE_COMPLETION_TIME, avgTime, sprint, team, user));

            long bugs = sprint.getTasks().stream()
                    .filter(t -> user.equals(t.getAssignedTo()) && t.isBug())
                    .count();
            long features = sprint.getTasks().stream()
                    .filter(t -> user.equals(t.getAssignedTo()) && t.isFeature())
                    .count();
            double bugFeatureRatio = features == 0 ? bugs : (double) bugs / features;
            snapshots.add(createSnapshot(KpiType.BUGS_VS_FEATURES_RATIO, bugFeatureRatio, sprint, team, user));

            double userWorkload = sprint.getTasks().stream()
                    .filter(t -> user.equals(t.getAssignedTo()))
                    .mapToDouble(Task::getStoryPoints)
                    .sum();
            double avgWorkload = team.getMembers().stream()
                    .mapToDouble(u -> sprint.getTasks().stream()
                            .filter(t -> u.equals(t.getAssignedTo()))
                            .mapToDouble(Task::getStoryPoints)
                            .sum())
                    .average().orElse(0);
            double workloadBalance = avgWorkload == 0 ? 1 : userWorkload / avgWorkload;
            snapshots.add(createSnapshot(KpiType.WORKLOAD_BALANCE, workloadBalance, sprint, team, user));
        }

        // Save all snapshots in a single batch
        snapshotRepo.saveAll(snapshots);
    }

    private KpiSnapshot createSnapshot(KpiType type, double value, Sprint sprint, Team team, AppUser user) {
        return KpiSnapshot.builder()
                .kpiType(type)
                .value(value)
                .sprint(sprint)
                .team(team)
                .user(user)
                .build();
    }
}
