const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function inviteUserToTeam(
  teamId: number,
  email: string,
): Promise<string> {
  const response = await fetch(
    `${BASE_URL}/api/v2/team/${teamId}/invite?email=${encodeURIComponent(email)}`,
    {
      method: "POST",
    },
  );

  // Check if response is ok (status 200-299)
  if (!response.ok) {
    const errorText = await response.text(); // Read the response body as text
    throw new Error(errorText || "Failed to invite user.");
  }

  // Assuming the response body is JSON
  const data = await response.json(); // Parse response as JSON
  return data.message || "Invitation sent successfully"; // Adjust based on your backend response
}
