import {z} from "zod";

export const AppUserDtoSchema = z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
});
