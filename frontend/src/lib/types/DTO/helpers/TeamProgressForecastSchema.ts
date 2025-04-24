import { z } from "zod";

export const TeamProgressForecastSchema = z.object({
  timeElapsedPct: z.number().optional(),
  workPct: z.number().optional(),
});
