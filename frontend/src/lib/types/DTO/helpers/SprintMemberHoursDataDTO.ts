import {z} from "zod";

export const MemberHoursItemSchema = z.object({
    memberName: z.string(),
    hours: z.number(),
});

export const SprintMemberHoursDataItemSchema = z.object({
        sprintName:    z.string(),
        hoursByMember: z.array(MemberHoursItemSchema),
});

export type MemberHoursItemDTO = z.infer<typeof MemberHoursItemSchema>;
export const SprintMemberHoursDataSchema = z.array(SprintMemberHoursDataItemSchema);
export type SprintMemberHoursDataDTO = z.infer<typeof SprintMemberHoursDataSchema>;
