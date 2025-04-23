import {z} from "zod";

export const ProgressForecastSchema = z.object({
    timeElapsedPct: z.number(),
    taskCompletionPct: z.number(),
});

export type ProgressForecast = z.infer<typeof ProgressForecastSchema>;
