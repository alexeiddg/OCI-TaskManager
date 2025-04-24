"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import FloatingTelegramButton from "@/components/FloatingTelegramButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {ThemeProvider} from "next-themes";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-muted-foreground">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.replace("/login");
  }

  if (status === "authenticated" && session?.user.teamId == null) {
    router.replace("/redirect");
  }

  return (
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
    <SidebarProvider>
      <AppSidebar
        variant="inset"
        user={{
          name: session?.user?.name ?? "Unknown",
          email: session?.user?.email ?? "unknown@example.com",
          avatar: "https://github.com/shadcn.png",
        }}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
        <FloatingTelegramButton />
      </SidebarInset>
    </SidebarProvider>
      </ThemeProvider>
  );
}
