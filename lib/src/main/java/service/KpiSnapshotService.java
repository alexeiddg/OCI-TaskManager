package service;

import enums.KpiType;
import lombok.RequiredArgsConstructor;
import model.AppUser;
import model.KpiSnapshot;
import model.Sprint;
import model.Team;
import org.springframework.stereotype.Service;
import repository.KpiSnapshotRepository;

@Service
@RequiredArgsConstructor
public class KpiSnapshotService {
    private final KpiSnapshotRepository snapshotRepo;
    private final KpiCalculationService kpiCalc;

    public void snapshotForSprint(Sprint sprint) {
        Team team = sprint.getProject().getTeam();

        save(KpiType.SPRINT_COMPLETION_RATE, kpiCalc.calculateSprintCompletionRate(sprint), sprint, team, null);
        save(KpiType.SPRINT_VELOCITY, kpiCalc.calculateSprintVelocity(sprint), sprint, team, null);
        save(KpiType.BUGS_VS_FEATURES_RATIO, kpiCalc.calculateBugsVsFeatures(sprint), sprint, team, null);
        save(KpiType.AVERAGE_COMPLETION_TIME, kpiCalc.calculateAverageCompletionTime(sprint), sprint, team, null);
        save(KpiType.WORKLOAD_BALANCE, kpiCalc.calculateWorkloadBalance(sprint), sprint, team, null);

        // By-user efficiency (and workload if you define it)
        for (AppUser user : team.getMembers()) {
            double efficiency = kpiCalc.calculateEfficiency(user, sprint);
            save(KpiType.EFFICIENCY_SCORE, efficiency, sprint, team, user);
        }
    }

    private void save(KpiType type, double value, Sprint sprint, Team team, AppUser user) {
        KpiSnapshot snapshot = KpiSnapshot.builder()
                .kpiType(type)
                .value(value)
                .sprint(sprint)
                .team(team)
                .user(user)
                .build();

        snapshotRepo.save(snapshot);
    }
}
