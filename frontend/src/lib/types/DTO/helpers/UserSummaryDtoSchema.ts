import {z} from "zod";

export const UserSummaryDtoSchema = z.object({
    id: z.number(),
    fullName: z.string(),
});
