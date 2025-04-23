import {z} from "zod";
import {TaskTypeBreakdownSchema} from "@/lib/types/DTO/helpers/TaskTypeBreakdownSchema";
import {ProgressForecastSchema} from "@/lib/types/DTO/helpers/ProgressForecastSchema";

export const KpiDtoSchema = z.object({
    sprintCompletionRate: z.number(),
    sprintVelocity: z.number(),
    bugsVsFeatures: z.number(),
    averageCompletionTime: z.number(),

    averageLoggedHours: z.number(),
    efficiency: z.number(),
    estimateAccuracy: z.number(),
    estimateErrorPct: z.number(),

    workloadBalance: z.number(),
    focusScore: z.number(),

    blockedTasks: z.number(),
    highPriorityPending: z.number(),
    overdueTasks: z.number(),
    sprintScopeAtRisk: z.boolean(),

    taskTypeBreakdown: TaskTypeBreakdownSchema,
    progressForecast: ProgressForecastSchema,
});
export type KpiDto = z.infer<typeof KpiDtoSchema>;
