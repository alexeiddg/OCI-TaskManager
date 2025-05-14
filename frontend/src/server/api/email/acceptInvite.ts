const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function acceptTeamInvite(userId: string, teamId: string) {
  const response = await fetch(
    `${BASE_URL}/api/v2/team/accept-invite?userId=${userId}&teamId=${teamId}`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to accept the invitation.");
  }

  const data = await response.json();
  return data.message || "Successfully joined the team!";
}
