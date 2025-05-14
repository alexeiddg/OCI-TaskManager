import {SprintStatus} from "@/lib/types/enums/SprintStatus";
import {SprintSchemaValues} from "@/lib/types/DTO/model/SprintDto";

export async function updateSprintStatus(
    sprintId: number,
    status: SprintStatus,
): Promise<SprintSchemaValues> {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/sprint/${sprintId}/status?status=${status}`;

    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update sprint status: ${response.status} - ${errorText}`);
    }

    return response.json();
}
