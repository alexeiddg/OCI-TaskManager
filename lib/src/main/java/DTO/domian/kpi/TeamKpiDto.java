package DTO.domian.kpi;

import DTO.helpers.UserSummaryDto;

import java.util.List;

public record TeamKpiDto(
        int    sprintVelocity,
        double completionRate,
        double averageEfficiency,
        double averageCompletionTime,
        double bugFeatureRatio,
        double workloadBalance,

        // 7–10: risk & blockers
        long   blockedTasks,
        long   highPriorityPending,
        long   overdueTasks,
        boolean scopeAtRisk,

        // 11: aggregate total time
        double totalTimeLogged,

        // 12–13: breakdowns
        TeamTaskTypeBreakdown taskTypeBreakdown,
        TeamProgressForecast  progressForecast,

        // 14–15: focus & top contributors
        double focusScore,
        List<UserSummaryDto> topContributors
) { }
