import {SprintMemberTasksDataDTO, SprintMemberTasksDataSchema} from "@/lib/types/DTO/helpers/SprintMemberTasksDataDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function fetchCompletedTasksByMemberPerSprint(teamId: number): Promise<SprintMemberTasksDataDTO> {
    const url = `${BASE_URL}/api/charts/tasks-by-member/${teamId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch tasks by member");

    const json = await res.json();
    const parsed = SprintMemberTasksDataSchema.safeParse(json);
    if (!parsed.success) {
        console.error("Validation error in SprintMemberTasksDataDto", parsed.error);
        throw new Error("Invalid format for tasks by member per sprint");
    }
    return parsed.data;
}
