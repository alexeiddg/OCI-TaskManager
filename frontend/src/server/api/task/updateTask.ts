import { TaskModel } from "@/lib/types/DTO/model/Task";
import { UpdateTaskFormValues } from "@/lib/types/DTO/setup/UpdateTaskSchema";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export async function updateTask(
  data: UpdateTaskFormValues,
): Promise<TaskModel> {
  const resp = await fetch(`${BASE_URL}/api/v2/task/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return resp.json();
}
