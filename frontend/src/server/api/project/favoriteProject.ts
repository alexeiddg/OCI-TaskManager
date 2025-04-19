const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function toggleFavoriteProject(
  projectId: number,
  userId: number,
): Promise<boolean> {
  const url = `${BASE_URL}/api/v2/projects/${projectId}/favorite?userId=${userId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to toggle favorite status");
  }

  const data = await response.json();
  return data.favorite;
}
