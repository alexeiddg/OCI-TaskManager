import {SprintTotalHoursDTO, SprintTotalHoursSchema} from "@/lib/types/DTO/helpers/SprintTotalHoursDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function fetchSprintTotalHours(teamId: number): Promise<SprintTotalHoursDTO> {
    const url = `${BASE_URL}/api/charts/hours-per-sprint/${teamId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch total hours per sprint");

    const json = await res.json();
    const parsed = SprintTotalHoursSchema.safeParse(json);
    if (!parsed.success) {
        console.error("Validation error in SprintTotalHoursDto", parsed.error);
        throw new Error("Invalid format for total hours per sprint");
    }
    return parsed.data;
}
