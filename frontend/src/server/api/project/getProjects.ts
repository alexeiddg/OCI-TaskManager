import {
  ProjectListSchema,
  ProjectDto,
} from "@/lib/types/DTO/model/ProjectDto";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchProjectsByTeamAndUser(
  teamId: number,
  userId: number,
): Promise<ProjectDto[]> {
  const url = `${BASE_URL}/api/v2/projects/team/${teamId}/user/${userId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects.");
  }

  const data = await response.json();

  const parsed = ProjectListSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Invalid project data", parsed.error);
    throw new Error("Invalid project data format received.");
  }

  return parsed.data;
}
