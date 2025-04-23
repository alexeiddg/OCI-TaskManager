import {z} from "zod";
import {TeamTaskTypeBreakdownSchema} from "@/lib/types/DTO/helpers/TeamTaskTypeBreakdownSchema";
import {TeamProgressForecastSchema} from "@/lib/types/DTO/helpers/TeamProgressForecastSchema";
import {UserSummaryDtoSchema} from "@/lib/types/DTO/helpers/UserSummaryDtoSchema";

export const TeamKpiDtoSchema = z.object({
    sprintVelocity: z.number(),
    completionRate: z.number(),
    averageEfficiency: z.number(),
    averageCompletionTime: z.number(),
    bugFeatureRatio: z.number(),
    workloadBalance: z.number(),

    blockedTasks: z.number(),
    highPriorityPending: z.number(),
    overdueTasks: z.number(),
    scopeAtRisk: z.boolean(),

    totalTimeLogged: z.number(),

    taskTypeBreakdown: TeamTaskTypeBreakdownSchema,
    progressForecast: TeamProgressForecastSchema,

    focusScore: z.number(),
    topContributors: z.array(UserSummaryDtoSchema),
});
export type TeamKpiDto = z.infer<typeof TeamKpiDtoSchema>;
