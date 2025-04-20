import {Task, TaskModel} from "@/lib/types/DTO/model/Task";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export async function fetchTasksByUserId(userId: number): Promise<TaskModel[]> {
    const res = await fetch(`${BASE_URL}/api/v2/task/user/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch tasks for user ${userId}`);
    }

    const data = await res.json();
    console.log(data)
    return Task.array().parse(data);
}
