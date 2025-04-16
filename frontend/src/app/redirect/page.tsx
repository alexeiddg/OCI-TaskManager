"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostLoginRouter() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  console.log(session);
  console.log("token:" + session?.user.accessToken); // TODO: Please remove this for V1

  // Animate progress bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  // Routing logic
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user) {
      toast.warning("Please login first");
      router.replace("/login");
      return;
    }

    const { role, teamId } = session.user;

    if (role === "MANAGER" && teamId == null && status === "authenticated") {
      toast.info("Complete your team setup");
      router.replace("/create");
      return;
    }

    if (role === "DEVELOPER" && teamId == null && status === "authenticated") {
      toast.info("Awaiting manager team assignment");
      router.replace("redirect/await-team");
      return;
    }

    router.replace("/dashboard");
  }, [session, status, router]);

  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-gray-50"
      style={{
        backgroundImage:
          "url('https://static.oracle.com/cdn/apex/21.1.0/themes/theme_42/1.6/images/rw/textures/texture-16.png')",
      }}
    >
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Redirecting...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-center text-sm text-muted-foreground">
            Please wait while we redirect you
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
