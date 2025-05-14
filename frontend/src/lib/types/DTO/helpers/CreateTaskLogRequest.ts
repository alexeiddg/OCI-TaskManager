import { z } from "zod";

export const CreateTaskLogRequestSchema = z.object({
  taskId: z.number(),
  userId: z.number(),
  hoursLogged: z.number(),
});

export type CreateTaskLogRequest = z.infer<typeof CreateTaskLogRequestSchema>;
