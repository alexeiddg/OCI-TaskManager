import { CreateTaskLogRequest } from "@/lib/types/DTO/helpers/CreateTaskLogRequest";
import { TaskLogDto, TaskLogDtoSchema } from "@/lib/types/DTO/model/TaskLogDto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export async function addTaskLog(
  payload: CreateTaskLogRequest,
): Promise<TaskLogDto> {
  const res = await fetch(`${BASE_URL}/api/task-logs/${payload.taskId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to add log: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return TaskLogDtoSchema.parse(json);
}
