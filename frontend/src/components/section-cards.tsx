"use client";

import {
  IconLoader,
  IconTrendingUp,
  IconClockHour4,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import { useEffect, useState } from "react";
import { KpiDto } from "@/lib/types/DTO/model/KpiDto";
import { fetchKpiDto } from "@/server/api/kpi/getKpis";
import { useSession } from "next-auth/react";
import { fetchSprintAnalytics } from "@/server/api/sprint/getSprintAnalytics";
import { SprintForAnalyticsModel } from "@/lib/types/DTO/helpers/SprintAnalyticsData";
import { TaskStatus } from "@/lib/types/enums/TaskStatus";

export function SectionCards() {
  const { data: session } = useSession();
  const [kpis, setKpis] = useState<KpiDto | null>(null);
  const [sprintData, setSprintData] = useState<SprintForAnalyticsModel | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = Number(session?.user?.id);
  const teamId = Number(session?.user?.teamId);
  const [avgCompletionTime, setAvgCompletionTime] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchKpiDto(userId)
      .then((data) => {
        setKpis(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch KPIs", err);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (!teamId) return;

    setLoading(true);
    fetchSprintAnalytics(teamId)
      .then((data) => {
        setSprintData(data);

        // Calculate average completion time
        const completedTasks = data.tasks.filter((t) => t.status === TaskStatus.DONE && t.completedAt);

        // Calculate average completion time
        const completionTimes = completedTasks.map((task) => {
          const createdDate = new Date(task.createdAt);
          const completedDate = new Date(task.completedAt!);
          return (completedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24); // days
        });

        const avgTime = completionTimes.length > 0
          ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length
          : 0;

        setAvgCompletionTime(avgTime);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch sprint analytics", err);
        setLoading(false);
      });
  }, [teamId]);

  if (loading || !kpis || !sprintData) {
    return (
      <Card className="@container/card mx-4 lg:mx-6 my-6">
        <CardContent className="flex items-center justify-center h-[300px]">
          <IconLoader className="animate-spin size-6 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* 1. Completion Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Completion Rate</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {(kpis.sprintCompletionRate * 100).toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp /> {(kpis.sprintCompletionRate * 100).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="flex gap-2 font-medium">
            Tasks done in this sprint <IconTrendingUp className="size-4" />
          </span>
          <span className="text-muted-foreground">
            Progress based on active sprint
          </span>
        </CardFooter>
      </Card>

      {/* 2. Velocity */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Velocity</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {kpis.sprintVelocity} SP
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp /> SP Completed
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="flex gap-2 font-medium">
            Story points from completed tasks
          </span>
          <span className="text-muted-foreground">
            Total velocity this sprint
          </span>
        </CardFooter>
      </Card>

      {/* 3. Efficiency */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Efficiency</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {kpis.efficiency.toFixed(2)} SP/h
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp /> SP/hour
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="flex gap-2 font-medium">
            Output rate per hour logged
          </span>
          <span className="text-muted-foreground">Higher = more efficient</span>
        </CardFooter>
      </Card>

      {/* 4. Avg Completion Time */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Completion Time</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {avgCompletionTime !== null ? avgCompletionTime.toFixed(1) : "0.0"} days
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClockHour4 /> Avg Time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <span className="flex gap-2 font-medium">
            Time from assignment to completion
          </span>
          <span className="text-muted-foreground">Based on {sprintData.tasks.filter(t => t.status === TaskStatus.DONE && t.completedAt).length} completed tasks</span>
        </CardFooter>
      </Card>
    </div>
  );
}
