import { toast } from "sonner";
import { TaskModel } from "@/lib/types/DTO/model/Task";

const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

/* ------------------------------------------------------------------ */
/*  COMPLETE / RE‑OPEN                                                */
/* ------------------------------------------------------------------ */
export async function apiCompleteTask(taskId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/v2/task/${taskId}/complete`, {
        method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to mark task completed");
    toast.success("Task marked completed");
}

/* ------------------------------------------------------------------ */
/*  HARD DELETE                                                       */
/* ------------------------------------------------------------------ */
export async function apiDeleteTask(taskId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/v2/task/${taskId}/soft-delete`, {
        method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to delete task");
    toast.success("Task deleted");
}

/* ------------------------------------------------------------------ */
/*  CLONE / COPY                                                      */
/* ------------------------------------------------------------------ */
export async function apiCopyTask(
    template: TaskModel,
    userId: number
): Promise<TaskModel> {
    const req: {
        taskName: string;
        taskDescription: string;
        taskPriority: TaskModel["priority"];
        taskStatus: TaskModel["status"];
        taskType: TaskModel["type"];
        storyPoints: number;
        dueDate: string;
        sprintId: number;
        createdBy: number;
        assignedTo: number | null;
        isFavorite: boolean;
    } = {
        taskName: `${template.taskName} (copy)`,
        taskDescription: template.taskDescription,
        taskPriority: template.priority,
        taskStatus: template.status,
        taskType: template.type,
        storyPoints: template.storyPoints,
        dueDate: template.dueDate,
        sprintId: template.sprintId,
        createdBy: Number(userId),
        assignedTo:
            template.createdById !== null && template.createdById !== undefined
                ? Number(template.createdById)
                : null,
        isFavorite: false,
    };

    const res = await fetch(`${BASE_URL}/api/v2/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    });

    if (!res.ok) throw new Error("Failed to create copy");

    const created: TaskModel = await res.json();
    toast.success("Copy created");
    return created;
}
