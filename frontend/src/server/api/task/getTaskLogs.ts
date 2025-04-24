import {TaskLogDto, TaskLogDtoSchema} from "@/lib/types/DTO/model/TaskLogDto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export async function fetchTaskLogs(
    taskId: number,
    userId: number
): Promise<TaskLogDto[]> {
    const res = await fetch(
        `${BASE_URL}/api/task-logs/${taskId}?userId=${userId}`,
        { headers: { "Content-Type": "application/json" } }
    );
    if (!res.ok) {
        throw new Error(`Failed to fetch logs: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return TaskLogDtoSchema.array().parse(json);
}

