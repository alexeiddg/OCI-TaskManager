import {KpiDto, KpiDtoSchema} from "@/lib/types/DTO/model/KpiDto";
import {TeamKpiDto, TeamKpiDtoSchema} from "@/lib/types/DTO/model/TeamKpiDtoSchema";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;


export async function fetchKpiDto(
    userId: number
): Promise<KpiDto> {
    const url = `${BASE_URL}/api/v2/kpis/user/${userId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch personal KPI data.");
    }
    const json = await res.json();
    const parsed = KpiDtoSchema.safeParse(json);
    if (!parsed.success) {
        console.error("KPI DTO validation error", parsed.error);
        throw new Error("Invalid KPI data format received.");
    }
    return parsed.data;
}

export async function fetchTeamKpiDto(
    sprintId: number
): Promise<TeamKpiDto> {
    const url = `${BASE_URL}/api/v2/kpis/sprint/${sprintId}/team`;
    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch team KPI data.");
    }
    const json = await res.json();
    const parsed = TeamKpiDtoSchema.safeParse(json);
    if (!parsed.success) {
        console.error("Team KPI DTO validation error", parsed.error);
        throw new Error("Invalid team KPI data format received.");
    }
    return parsed.data;
}
