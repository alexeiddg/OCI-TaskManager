import {z} from "zod";

export const TaskSummaryItemSchema = z.object({
    id: z.number().int(),
    taskName: z.string(),
    developerName: z.string(),
    estimatedHours: z.number().int(),
    actualHours: z.number().int(),
});

export const TaskSummarySchema = z.array(TaskSummaryItemSchema);
export type TaskSummaryDTO = z.infer<typeof TaskSummarySchema>;
