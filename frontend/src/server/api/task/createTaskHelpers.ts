import type {AppUserDto} from "@/lib/types/DTO/model/AppUserDto";
import type {SprintDto} from "@/lib/types/DTO/model/SprintDto";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchTeamMembers(teamId: string) {
    const r = await fetch(`${BASE}/api/v2/team/${teamId}/members`);
    if (!r.ok) throw new Error(r.statusText);
    return r.json() as Promise<AppUserDto[]>;
}

export async function fetchTeamSprints(teamId: string) {
    const r = await fetch(`${BASE}/api/v2/sprint/team/${teamId}`);
    if (!r.ok) throw new Error(r.statusText);
    return await r.json() as Promise<SprintDto[]>;
}

export async function fetchTaskDeps(teamId: string) {
    const [members, sprints] = await Promise.all([
        fetchTeamMembers(teamId),
        fetchTeamSprints(teamId),
    ]);
    return { members, sprints };
}
