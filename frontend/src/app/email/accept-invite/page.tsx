import { Suspense } from "react";
import AcceptInviteClient from "@/components/accept-invite-client";

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center h-screen text-center px-4">Loading...</div>}>
      <AcceptInviteClient />
    </Suspense>
  );
}
