import {z} from "zod";

export const TeamTaskTypeBreakdownSchema = z.object({
    bugs: z.number(),
    features: z.number(),
    improvements: z.number(),
});
