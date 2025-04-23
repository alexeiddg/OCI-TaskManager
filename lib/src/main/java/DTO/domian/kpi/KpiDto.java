package DTO.domian.kpi;

public record KpiDto(
        // sprint-level metrics
        double sprintCompletionRate,
        double sprintVelocity,
        double bugsVsFeatures,
        double averageCompletionTime,

        // user-level metrics
        double averageLoggedHours,
        double efficiency,
        double estimateAccuracy,
        double estimateErrorPct,

        // team balance & focus
        double workloadBalance,
        double focusScore,

        // counts & flags
        long blockedTasks,
        long highPriorityPending,
        long overdueTasks,
        boolean sprintScopeAtRisk,

        // breakdowns
        TaskTypeBreakdown taskTypeBreakdown,
        ProgressForecast progressForecast
) {}
