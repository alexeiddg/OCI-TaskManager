import {TaskSummaryDTO, TaskSummarySchema} from "@/lib/types/DTO/helpers/TaskSummaryDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function fetchTaskSummary(teamId: number): Promise<TaskSummaryDTO> {
    const url = `${BASE_URL}/api/charts/task-summary/${teamId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch task summary");

    const json = await res.json();
    const parsed = TaskSummarySchema.safeParse(json);
    if (!parsed.success) {
        console.error("Validation error in TaskSummaryDto", parsed.error);
        throw new Error("Invalid format for task summary");
    }
    return parsed.data;
}
