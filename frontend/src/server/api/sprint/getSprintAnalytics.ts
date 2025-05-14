import {
  SprintForAnalyticsSchema,
  SprintForAnalyticsModel,
} from "@/lib/types/DTO/helpers/SprintAnalyticsData";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function fetchSprintAnalytics(
  teamId: number,
): Promise<SprintForAnalyticsModel> {
  const url = `${BASE_URL}/api/v2/sprint/latest?teamId=${teamId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch Sprint Analytics.");
  }
  const json = await res.json();
  const parsed = SprintForAnalyticsSchema.safeParse(json);
  if (!parsed.success) {
    console.error("Sprint Analytics validation error", parsed.error);
    throw new Error("Invalid Sprint Analytics format received.");
  }
  return parsed.data;
}
