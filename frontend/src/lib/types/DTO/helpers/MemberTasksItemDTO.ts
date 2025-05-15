import { z } from "zod";

export const MemberTasksItemSchema = z.object({
    memberName: z.string(),
    completedTasks: z.number().int(),
});

export type MemberTasksItemDTO = z.infer<typeof MemberTasksItemSchema>;
