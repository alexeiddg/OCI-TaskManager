import {z} from "zod";

export const TeamProgressForecastSchema = z.object({
    timeElapsedPct: z.number(),
    workPct: z.number(),
});
