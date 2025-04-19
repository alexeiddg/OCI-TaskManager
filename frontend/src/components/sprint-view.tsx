"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {
  Calendar,
  ChevronDown,
  Filter,
  Flag,
  ListChecks,
  MoreHorizontal,
  Plus,
  Search,
  Timer,
  Users,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader,} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Progress} from "@/components/ui/progress";
import {Separator} from "@/components/ui/separator";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {cn} from "@/lib/utils";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible";
import {Checkbox} from "@/components/ui/checkbox";
import {Badge} from "@/components/ui/badge";
import {useSession} from "next-auth/react";
import {fetchProjectOptions, fetchSprintCards, ProjectOption, SprintCards} from "@/server/api/sprint/getSprints";
import {SprintStatus} from "@/lib/types/enums/SprintStatus";
import {TaskPriority} from "@/lib/types/enums/TaskPriority";

export function SprintsView() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<SprintStatus | "all">("all",);
  const [localSprints, setLocalSprints] = useState<SprintCards[]>([]);
  const [view, setView] = React.useState<"list" | "board">("list");

  // Filter sprints based on selected project, search query, and status filter
  const filteredSprints = React.useMemo(() => {
    return localSprints.filter((sprint) => {
      const matchesProject = sprint.projectId === selectedProject;
      const matchesSearch =
        sprint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sprint.goal?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || sprint.status === statusFilter;

      return matchesProject && matchesSearch && matchesStatus;
    });
  }, [localSprints, selectedProject, searchQuery, statusFilter]);

  // Get the selected project name
  const selectedProjectName = React.useMemo(() => {
    return projects.find((p) => p.id === Number(selectedProject))?.name || "";
  }, [selectedProject, projects]);

  // Calculate sprint metrics
  const sprintMetrics = React.useMemo(() => {
    const projectSprints = localSprints.filter(
      (s) => s.projectId === selectedProject,
    );

    return {
      total: projectSprints.length,
      active: projectSprints.filter((s) => s.status === SprintStatus.ACTIVE).length,
      completed: projectSprints.filter((s) => s.status === SprintStatus.COMPLETED).length,
      planning: projectSprints.filter((s) => s.status === SprintStatus.PLANNING).length,
      cancelled: projectSprints.filter((s) => s.status === SprintStatus.CANCELLED).length,
    };
  }, [localSprints, selectedProject]);

  // Toggle task completion
  const toggleTaskCompletion = (sprintId: number, taskId: number) => {
    setLocalSprints((prev) =>
      prev.map((sprint) => {
        if (sprint.id === sprintId) {
          const updatedTasks = sprint.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          );

          // Calculate new progress
          const completedTasks = updatedTasks.filter((t) => t.completed).length;
          const totalTasks = updatedTasks.length;
          const newProgress =
            totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0;

          return {
            ...sprint,
            tasks: updatedTasks,
            progress: newProgress,
          };
        }
        return sprint;
      }),
    );
  };


  useEffect(() => {
    const teamId = session?.user?.teamId;
    const userId = session?.user?.id;
    if (!teamId || !userId) return;

    fetchProjectOptions(Number(teamId), Number(userId))
        .then((data) => {
          setProjects(data);
          setSelectedProject(data[0]?.id);
        })
        .catch((err) => console.error("Failed to fetch projects:", err));
  }, [session]);

  useEffect(() => {
    if (!selectedProject) return;

    fetchSprintCards(Number(selectedProject))
        .then(setLocalSprints)
        .catch((err) => {
          console.error("Failed to fetch sprints:", err);
          setLocalSprints([]);
        });
  }, [selectedProject]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Sprints</h1>
              <Select
                value={selectedProject.toString()}
                onValueChange={(value) => setSelectedProject(Number(value))}
              >
                <SelectTrigger className="w-[200px] h-8">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground mt-1">
              Manage sprints for {selectedProjectName}
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Sprint
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-secondary/50">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">{sprintMetrics.total}</p>
              <p className="text-sm text-muted-foreground">Total Sprints</p>
            </CardContent>
          </Card>
          <Card className="bg-chart-1/10">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">{sprintMetrics.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card className="bg-chart-2/10">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">{sprintMetrics.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-chart-3/10">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">{sprintMetrics.planning}</p>
              <p className="text-sm text-muted-foreground">Planning</p>
            </CardContent>
          </Card>
          <Card className="bg-chart-5/10">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">{sprintMetrics.cancelled}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sprints..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as SprintStatus | "all")
              }
            >
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={view}
              onValueChange={(v) => setView(v as "list" | "board")}
              className="w-[180px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="board">Board View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <Tabs value={view} className="w-full">
          <TabsContent value="list" className="mt-0">
            <div className="space-y-4">
              {filteredSprints.length > 0 ? (
                filteredSprints.map((sprint) => (
                  <SprintCard
                    key={sprint.id}
                    sprint={sprint}
                    onToggleTask={(taskId) =>
                      toggleTaskCompletion(sprint.id, taskId)
                    }
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No sprints found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery
                      ? `No sprints matching "${searchQuery}"`
                      : "Try creating a new sprint or changing filters"}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="board" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SprintColumn
                title="Planning"
                sprints={filteredSprints.filter((s) => s.status === SprintStatus.PLANNING)}
                onToggleTask={toggleTaskCompletion}
              />
              <SprintColumn
                title="Active"
                sprints={filteredSprints.filter((s) => s.status === SprintStatus.ACTIVE)}
                onToggleTask={toggleTaskCompletion}
              />
              <SprintColumn
                title="Completed"
                sprints={filteredSprints.filter(
                  (s) => s.status === SprintStatus.COMPLETED,
                )}
                onToggleTask={toggleTaskCompletion}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SprintCard({
  sprint,
  onToggleTask,
}: {
  sprint: SprintCards;
  onToggleTask: (taskId: number) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status: SprintStatus) => {
    switch (status) {
      case SprintStatus.PLANNING:
        return "var(--chart-3)";
      case SprintStatus.ACTIVE:
        return "var(--chart-1)";
      case SprintStatus.COMPLETED:
        return "var(--chart-2)";
      case SprintStatus.CANCELLED:
        return "var(--chart-5)";
      default:
        return "var(--primary)";
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return (
          <Badge variant="destructive" className="ml-2">
            High
          </Badge>
        );
      case TaskPriority.MEDIUM:
        return (
          <Badge variant="outline" className="ml-2 border-chart-3 text-chart-3">
            Medium
          </Badge>
        );
      case TaskPriority.LOW:
        return (
          <Badge
            variant="outline"
            className="ml-2 border-muted-foreground text-muted-foreground"
          >
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  const completedTasks = sprint.tasks.filter((t) => t.completed).length;
  const totalTasks = sprint.tasks.length;

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        sprint.status === SprintStatus.COMPLETED && "border-chart-2/20 bg-chart-2/5",
        sprint.status === SprintStatus.ACTIVE && "border-chart-1/20 bg-chart-1/5",
        sprint.status === SprintStatus.PLANNING && "border-chart-3/20 bg-chart-3/5",
        sprint.status === SprintStatus.CANCELLED && "border-chart-5/20 bg-chart-5/5",
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-lg">{sprint.name}</h3>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span
                className="inline-flex h-2 w-2 rounded-full mr-1"
                style={{ backgroundColor: getStatusColor(sprint.status ?? SprintStatus.PLANNING) }}
              />
              <span className="capitalize">{sprint.status}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit sprint</DropdownMenuItem>
              <DropdownMenuItem>Change status</DropdownMenuItem>
              <DropdownMenuItem>Add tasks</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete sprint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground mb-4">{sprint.goal}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Start Date</span>
            <span className="text-sm font-medium">
              {formatDate(sprint.startDate)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">End Date</span>
            <span className="text-sm font-medium">
              {formatDate(sprint.endDate)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {completedTasks} of {totalTasks} tasks ({sprint.progress}%)
            </span>
          </div>
          <Progress
            value={sprint.progress}
            className="h-2 bg-secondary [&>[data-role=indicator]]:bg-primary"
          />
        </div>
      </CardContent>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="px-4 pb-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex justify-between"
            >
              <span>Tasks</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <CardContent className="pt-0 px-4">
            <Separator className="mb-2" />
            <div className="space-y-2">
              {sprint.tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2 py-1">
                  <Checkbox
                    id={task.id.toString()}
                    checked={task.completed}
                    onCheckedChange={() => onToggleTask(task.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={task.id.toString()}
                      className={cn(
                        "text-sm font-medium cursor-pointer flex items-center",
                        task.completed && "line-through text-muted-foreground",
                      )}
                    >
                      {task.name}
                      {getPriorityBadge(task.priority)}
                    </label>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span className="flex items-center mr-3">
                        <Users className="h-3 w-3 mr-1" />
                        {task.assignee}
                      </span>
                      <span className="flex items-center">
                        <Timer className="h-3 w-3 mr-1" />
                        {task.estimate}h
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center">
            <ListChecks className="mr-1 h-3 w-3" />
            <span>
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
          <div className="flex items-center">
            <Flag className="mr-1 h-3 w-3" />
            <span>
              {sprint.tasks.filter((t) => t.priority === TaskPriority.HIGH).length} high
              priority
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function SprintColumn({
  title,
  sprints,
  onToggleTask,
}: {
  title: string;
  sprints: SprintCards[];
  onToggleTask: (sprintId: number, taskId: number) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="font-medium text-sm">
          {title} ({sprints.length})
        </h3>
      </div>
      <div className="bg-secondary/30 rounded-lg p-2 h-full min-h-[200px]">
        {sprints.length > 0 ? (
          <div className="space-y-3">
            {sprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                onToggleTask={(taskId) => onToggleTask(sprint.id, taskId)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No sprints in {title.toLowerCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
