"use server";

import { auth } from "@/lib/auth/auth";
import { TeamCreationRequest } from "@/lib/types/DTO/setup/teamCreationReq";

export async function submitSetupForm(data: TeamCreationRequest) {
  const session = await auth();

  if (!session?.user?.accessToken) {
    throw new Error("❌ No access token found in session");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/setup/multi-create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(data),
      },
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Error ${res.status}: ${error}`);
    }

    return await res.text();
  } catch (error) {
    console.error("[submitSetupForm] Failed:", error);
    throw error;
  }
}
