"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TaskAddModal } from "@/components/create-task-modal";
import { fetchTaskDeps } from "@/server/api/task/createTaskHelpers";
import {
  InviteTeamMemberModal,
  InviteTeamMemberModalHandle,
} from "@/components/email-invite-modal";
import { Separator } from "@radix-ui/react-menu";
import * as React from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<
    { id: number; name: string }[]
  >([]);
  const [sprints, setSprints] = useState<{ id: number; sprintName: string }[]>(
    [],
  );
  const inviteModalRef = useRef<InviteTeamMemberModalHandle>(null);

  const teamId = session?.user?.teamId;

  useEffect(() => {
    const teamId = session?.user?.teamId;
    if (!teamId) return;

    fetchTaskDeps(teamId.toString())
      .then(({ members, sprints }) => {
        setTeamMembers(members);
        setSprints(sprints || []);
      })
      .catch((err) => console.error("Failed to fetch task dependencies:", err));
  }, [session]);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <div className="flex items-center gap-2">
                <IconCirclePlusFilled />
                <span>Quick Create</span>
              </div>
            </SidebarMenuButton>
            {/* Email invite Modal */}
            <div className="size-8 group-data-[collapsible=icon]:opacity-0">
              <span className="sr-only">Inbox</span>
              {typeof teamId === "number" && (
                  <InviteTeamMemberModal ref={inviteModalRef} teamId={teamId} />
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              pathname.startsWith(item.url + "/dashboard");

            return (
              <SidebarMenuItem key={item.title}>
                <Separator />
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      isActive &&
                        "bg-muted text-foreground hover:bg-muted/90 hover:text-foreground",
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>

      {/* Task Creation Modal */}
      <TaskAddModal
        open={isTaskModalOpen}
        onOpenChange={(open) => {
          setIsTaskModalOpen(open);
        }}
        sprints={sprints}
        users={teamMembers}
        currentUser={
          session?.user
            ? {
                id: Number(session.user.id),
                name: session.user.name || "Current User",
              }
            : { id: 0, name: "No User Found" }
        }
        session={session!}
      />
    </SidebarGroup>
  );
}
