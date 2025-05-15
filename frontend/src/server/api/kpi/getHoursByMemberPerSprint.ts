import {SprintMemberHoursDataDTO, SprintMemberHoursDataSchema} from "@/lib/types/DTO/helpers/SprintMemberHoursDataDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function fetchHoursByMemberPerSprint(teamId: number): Promise<SprintMemberHoursDataDTO> {
    const url = `${BASE_URL}/api/charts/hours-by-member/${teamId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch hours by member");

    const json = await res.json();
    const parsed = SprintMemberHoursDataSchema.safeParse(json);
    if (!parsed.success) {
        console.error("Validation error in SprintMemberHoursDataDto", parsed.error);
        throw new Error("Invalid format for member hours per sprint");
    }
    return parsed.data;
}
