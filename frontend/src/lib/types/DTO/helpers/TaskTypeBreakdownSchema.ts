import {z} from "zod";

export const TaskTypeBreakdownSchema = z.object({
    bugs: z.number(),
    features: z.number(),
    improvements: z.number(),
});

export type TaskTypeBreakdown = z.TypeOf<typeof TaskTypeBreakdownSchema>;
