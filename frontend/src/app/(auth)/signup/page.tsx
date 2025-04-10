import { GalleryVerticalEnd } from "lucide-react";
import { Mosaic } from "@/components/right-mosaic";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export default function LoginPage() {
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
            <SignupForm />
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
