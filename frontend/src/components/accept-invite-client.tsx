"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { acceptTeamInvite } from "@/server/api/email/acceptInvite";

export default function AcceptInviteClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");
  const teamId = searchParams.get("teamId");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (userId && teamId) {
      setStatus("loading");

      acceptTeamInvite(userId, teamId)
        .then((msg) => {
          setStatus("success");
          setMessage(msg);
          setTimeout(() => router.push("/login"), 3000); // Redirect after 3 seconds
        })
        .catch((err) => {
          setStatus("error");
          setMessage(err.message || "Failed to join the team.");
        });
    }
  }, [userId, teamId, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {status === "loading" && <p>Processing your invitation...</p>}
      {status === "success" && (
        <div>
          <p className="text-green-600 font-semibold">{message}</p>
          <p>Redirecting you to the login page...</p>
        </div>
      )}
      {status === "error" && (
        <div>
          <p className="text-red-600 font-semibold">{message}</p>
          <p>Please try again or contact support.</p>
        </div>
      )}
    </div>
  );
}