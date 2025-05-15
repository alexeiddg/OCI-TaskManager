import { z } from "zod";
import { MemberTasksItemSchema } from "./MemberTasksItemDTO";

export const SprintMemberTasksDataItemSchema = z.object({
    sprintName:    z.string(),
    tasksByMember: z.array(MemberTasksItemSchema),
});

export const SprintMemberTasksDataSchema = z.array(SprintMemberTasksDataItemSchema);
export type SprintMemberTasksDataDTO = z.infer<typeof SprintMemberTasksDataSchema>;
