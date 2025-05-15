import {z} from "zod";

export const SprintTotalHoursItem = z.object({
    sprintName: z.string(),
    totalHours: z.number(),
});

export const SprintTotalHoursSchema = z.array(SprintTotalHoursItem);
export type SprintTotalHoursDTO = z.infer<typeof SprintTotalHoursSchema>;
