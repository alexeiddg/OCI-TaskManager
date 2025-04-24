import { z } from "zod";

export const TaskLogDtoSchema = z.object({
    id: z.number(),
    taskId: z.number(),
    userId: z.number(),
    hoursLogged: z.number(),
    logDate: z.string(),
});

export type TaskLogDto = z.infer<typeof TaskLogDtoSchema>;
