"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { Mosaic } from "@/components/right-mosaic";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitSignupForm } from "@/server/auth/signup";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  console.log(error)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const { success, message } = await submitSignupForm(
        formData,
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/auth/signup`,
      );

      if (success) {
        toast.success("Account created successfully!");

        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (result?.ok) {
          toast.success("Account created successfully!", {
            description: "Welcome aboard!",
          });
          router.push("/redirect");
        } else {
          toast.warning("login failed.", {
            description: "Please try logging in manually.",
          });
          setError("Signup successful, but login failed.");
        }
      } else {
        toast.error("Signup failed", {
          description: message || "Something went wrong",
        });
        setError(message || "Something went wrong");
      }
    } catch (error) {
      console.error("❌ Signup error:", error);
      toast.error("Network error", {
        description: "Could not reach the server. Please try again later.",
      });
      setError("Could not reach the server");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* LEFT SIDE: Login form area (unchanged) */}
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-background">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Mosaic fills screen, overflows if needed */}
      <div className="flex flex-col items-center justify-center">
        <Mosaic />
      </div>
    </div>
  );
}
