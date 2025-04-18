import { CreateTaskFormValues } from "@/lib/types/DTO/setup/TaskCreationSchema";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export async function createTaskRequest(task: CreateTaskFormValues) {
    const body = {
        ...task,
        isFavorite: Boolean(task.isFavorite),
        dueDate: task.dueDate,
        sprintId: task.sprint,
        assignedTo: task.assignedTo || null,
    };

    const response = await fetch(`${BASE_URL}/api/v2/task`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    return await response.json();
}
