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
import {SprintEditModal} from "@/components/edit-sprint-modal";
import {SprintStatusModal} from "@/components/sprint-status-modal";
import {SprintSchemaValues} from "@/lib/types/DTO/model/SprintDto";
import {TaskAddModal} from "@/components/create-task-modal";
import {createTaskRequest} from "@/server/api/task/createTask";
import {fetchTaskDeps} from "@/server/api/task/createTaskHelpers";
import type {AppUserDto} from "@/lib/types/DTO/model/AppUserDto";
import type {CreateTaskFormValues} from "@/lib/types/DTO/setup/TaskCreationSchema";

export function SprintsView() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<SprintStatus | "all">("all",);
  const [localSprints, setLocalSprints] = useState<SprintCards[]>([]);
  const [view, setView] = React.useState<"list" | "board">("list");

  // Add state for the edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<SprintSchemaValues | null>(null);

  // Add state for the status modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusEditingSprint, setStatusEditingSprint] = useState<{id: number, sprintName: string, status: SprintStatus} | null>(null);

  // Add state for the task creation modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskCreationSprint, setTaskCreationSprint] = useState<{id: number, sprintName: string} | null>(null);
  const [teamMembers, setTeamMembers] = useState<AppUserDto[]>([]);

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

          // Calculate new progress - fixed calculation
          const completedTasks = updatedTasks.filter((t) => t.completed).length;
          const totalTasks = updatedTasks.length;
          const newProgress = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);

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

  // Handle edit sprint - map SprintCards to the Sprint interface expected by the modal
  const handleEditSprint = (sprintCard: SprintCards) => {
    const projectObj = projects.find((p) => p.id === sprintCard.projectId);
    if (!projectObj) return;

    // Map tasks from SprintCards format to the format expected by the modal
    const mappedTasks = sprintCard.tasks.map(task => ({
      id: task.id,
      name: task.name,
      completed: task.completed,
    }));

    // Calculate completion metrics if not provided
    const completedTasks = sprintCard.tasks.filter(task => task.completed).length;
    const totalTasks = sprintCard.tasks.length;
    const completionRate = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);

    setTimeout(() => {
      const projectObj = projects.find((p) => p.id === sprintCard.projectId);
      if (!projectObj) return;

      // Map tasks from SprintCards format to the format expected by the modal
      const mappedTasks = sprintCard.tasks.map(task => ({
        id: task.id,
        name: task.name,
        completed: task.completed,
      }));

      // Calculate completion metrics if not provided
      const completedTasks = sprintCard.tasks.filter(task => task.completed).length;
      const totalTasks = sprintCard.tasks.length;
      const completionRate = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);

      setEditingSprint({
        id: sprintCard.id,
        sprintName: sprintCard.name,
        sprintDescription: sprintCard.goal || "",
        startDate: sprintCard.startDate,
        endDate: sprintCard.endDate,
        status: sprintCard.status ?? SprintStatus.PLANNING,
        projectId: sprintCard.projectId,
        project: { id: projectObj.id, name: projectObj.name },
        tasks: mappedTasks,
        isActive: sprintCard.status === SprintStatus.ACTIVE,
        completedTasks: completedTasks,
        totalTasks: totalTasks,
        completionRate: sprintCard.progress ?? completionRate,
        createdAt: sprintCard.startDate,
        updatedAt: null,
      });

      setIsModalOpen(true);
    }, 10);
  };

  // Handle change status - prepare sprint data for status modal
  const handleChangeStatus = (sprintCard: SprintCards) => {
    setStatusEditingSprint({
      id: sprintCard.id,
      sprintName: sprintCard.name,
      status: sprintCard.status ?? SprintStatus.PLANNING
    });
    setIsStatusModalOpen(true);
  };

  // Handle status update - update sprint status in local state
  const handleStatusUpdate = async (sprintId: number, newStatus: SprintStatus): Promise<void> => {
    // This would be replaced with actual API calls in production
    console.log("Sprint status updated:", sprintId, newStatus);

    // Update local state
    setLocalSprints(prev =>
      prev.map(sprint => {
        if (sprint.id === sprintId) {
          return {
            ...sprint,
            status: newStatus
          };
        }
        return sprint;
      })
    );
  };

  // Handle add task - prepare sprint data for task modal
  const handleAddTask = (sprintCard: SprintCards) => {
    setTaskCreationSprint({
      id: sprintCard.id,
      sprintName: sprintCard.name
    });
    setIsTaskModalOpen(true);
  };

  // Handle task creation - create a new task and add it to the sprint
  const handleTaskCreate = async (taskData: CreateTaskFormValues): Promise<void> => {
    // This would be replaced with actual API calls in production
    console.log("Task created:", taskData);

    try {
      // Call the API to create the task
      const createdTask = await createTaskRequest(taskData);

      // Update local state with the new task
      setLocalSprints(prev =>
        prev.map(sprint => {
          if (sprint.id === taskData.sprint) {
            // Create a new task object in the format expected by SprintCards
            const newTask = {
              id: createdTask.id || Math.floor(Math.random() * 10000), // Use API response ID or generate a temporary one
              name: taskData.taskName,
              assignee: session?.user?.name || null,
              completed: taskData.taskStatus === "DONE",
              priority: taskData.taskPriority,
              estimate: taskData.storyPoints,
            };

            // Calculate new progress
            const updatedTasks = [...sprint.tasks, newTask];
            const completedTasks = updatedTasks.filter(t => t.completed).length;
            const totalTasks = updatedTasks.length;
            const newProgress = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);

            return {
              ...sprint,
              tasks: updatedTasks,
              progress: newProgress
            };
          }
          return sprint;
        })
      );

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to create task:", error);
      return Promise.reject(error);
    }
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

    // Fetch team members for task assignment
    if (teamId) {
      fetchTaskDeps(teamId.toString())
        .then(({ members }) => {
          setTeamMembers(members);
        })
        .catch((err) => console.error("Failed to fetch team members:", err));
    }
  }, [session]);

  useEffect(() => {
    if (!selectedProject) return;

    fetchSprintCards(Number(selectedProject))
      .then((sprints) => {
        // Calculate initial progress for each sprint
        const sprintsWithProgress = sprints.map(sprint => {
          const completedTasks = sprint.tasks.filter(task => task.completed).length;
          const totalTasks = sprint.tasks.length;
          const progress = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);

          return {
            ...sprint,
            progress: progress
          };
        });

        setLocalSprints(sprintsWithProgress);
      })
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
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              setEditingSprint(null);
              setIsModalOpen(true);
            }}
          >
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
                    onEditSprint={handleEditSprint}
                    onChangeStatus={handleChangeStatus}
                    onAddTask={handleAddTask}
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
                onEditSprint={handleEditSprint}
                onChangeStatus={handleChangeStatus}
                onAddTask={handleAddTask}
              />
              <SprintColumn
                title="Active"
                sprints={filteredSprints.filter((s) => s.status === SprintStatus.ACTIVE)}
                onToggleTask={toggleTaskCompletion}
                onEditSprint={handleEditSprint}
                onChangeStatus={handleChangeStatus}
                onAddTask={handleAddTask}
              />
              <SprintColumn
                title="Completed"
                sprints={filteredSprints.filter(
                  (s) => s.status === SprintStatus.COMPLETED,
                )}
                onToggleTask={toggleTaskCompletion}
                onEditSprint={handleEditSprint}
                onChangeStatus={handleChangeStatus}
                onAddTask={handleAddTask}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Render the SprintEditModal */}
      <SprintEditModal
        open={isModalOpen}
        onOpenChange={(open) => {
            setIsModalOpen(open);
            // If modal is closing, ensure we clean up any editing state
            if (!open) {
                // Reset editing sprint if needed
                setEditingSprint(null);
            }
        }}
        sprint={editingSprint}
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        onSave={async (updatedSprint) => {
          // This would be replaced with actual API calls in production
          console.log("Sprint updated:", updatedSprint);

          if (updatedSprint.id) {
            // Update existing sprint
            const refreshedSprints = localSprints.map(sprint => {
              if (sprint.id === updatedSprint.id) {
                // Map tasks from the modal format back to SprintCards format
                const updatedTasks = updatedSprint.tasks.map(task => ({
                  id: task.id,
                  name: task.name,
                  assignee: sprint.tasks.find(t => t.id === task.id)?.assignee || "",
                  completed: task.completed,
                  priority: sprint.tasks.find(t => t.id === task.id)?.priority || "MEDIUM",
                  estimate: sprint.tasks.find(t => t.id === task.id)?.estimate || 0,
                }));

                // Calculate progress based on completed tasks
                const completedTasks = updatedTasks.filter(task => task.completed).length;
                const totalTasks = updatedTasks.length;
                const progress = totalTasks === 0 ? 0 : Math.floor((completedTasks / totalTasks) * 100);

                // Update the sprint with all new values
                return {
                  ...sprint,
                  name: updatedSprint.sprintName,
                  goal: updatedSprint.sprintDescription,
                  startDate: updatedSprint.startDate.toString(),
                  endDate: updatedSprint.endDate.toString(),
                  status: updatedSprint.status,
                  projectId: updatedSprint.project.id,
                  tasks: updatedTasks,
                  progress: progress,
                };
              }
              return sprint;
            });

            setLocalSprints(refreshedSprints);
          } else {
            // Create new sprint
            // In a real app, this would be an API call that returns the new sprint with an ID
            // For now, we'll simulate it by generating a temporary ID
            const newId = Math.max(0, ...localSprints.map(s => s.id)) + 1;

            // Create a new SprintCards object from the form data
            const newSprint: SprintCards = {
              id: newId,
              name: updatedSprint.sprintName,
              goal: updatedSprint.sprintDescription || null,
              projectId: updatedSprint.project.id,
              startDate: updatedSprint.startDate.toString(),
              endDate: updatedSprint.endDate.toString(),
              status: updatedSprint.status,
              progress: 0,
              tasks: updatedSprint.tasks.map(task => ({
                id: task.id || Math.floor(Math.random() * 10000), // Generate temporary ID for new tasks
                name: task.name,
                assignee: "",
                completed: task.completed,
                priority: "MEDIUM",
                estimate: 0,
              })),
            };

            setLocalSprints([...localSprints, newSprint]);
          }

          setIsModalOpen(false);
        }}
      />

      {/* Render the SprintStatusModal */}
      <SprintStatusModal
        open={isStatusModalOpen}
        onOpenChange={(open) => {
          setIsStatusModalOpen(open);
          // If modal is closing, ensure we clean up any editing state
          if (!open) {
            setStatusEditingSprint(null);
          }
        }}
        sprint={statusEditingSprint!}
        onStatusChange={handleStatusUpdate}
      />

      {/* Render the TaskAddModal */}
      <TaskAddModal
        open={isTaskModalOpen}
        onOpenChange={(open) => {
          setIsTaskModalOpen(open);
          // If modal is closing, ensure we clean up any editing state
          if (!open) {
            setTaskCreationSprint(null);
          }
        }}
        onSubmit={handleTaskCreate}
        sprints={localSprints.map(sprint => ({ id: sprint.id, sprintName: sprint.name }))}
        users={teamMembers}
        currentUser={session?.user ? { id: session.user.id, name: session.user.name || "Current User" } : { id: "0", name: "Current User" }}
        defaultSprintId={taskCreationSprint?.id}
        session={session}
      />
    </div>
  );
}

function SprintCard({
  sprint,
  onToggleTask,
  onEditSprint,
  onChangeStatus,
  onAddTask,
}: {
  sprint: SprintCards;
  onToggleTask: (taskId: number) => void;
  onEditSprint: (sprint: SprintCards) => void;
  onChangeStatus: (sprint: SprintCards) => void;
  onAddTask: (sprint: SprintCards) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<Record<number, boolean>>({});

  const handleEditSprint = (sprintCard: SprintCards) => {
    setDropdownOpen(prev => ({
      ...prev,
      [sprintCard.id]: false
    }));

    onEditSprint(sprintCard);
  };

  const handleChangeStatus = (sprintCard: SprintCards) => {
    setDropdownOpen(prev => ({
      ...prev,
      [sprintCard.id]: false
    }));

    onChangeStatus(sprintCard);
  };

  const handleAddTask = (sprintCard: SprintCards) => {
    setDropdownOpen(prev => ({
      ...prev,
      [sprintCard.id]: false
    }));

    onAddTask(sprintCard);
  };

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

          <DropdownMenu
              open={dropdownOpen[sprint.id] || false}
              onOpenChange={(open) => {
                setDropdownOpen(prev => ({
                  ...prev,
                  [sprint.id]: open
                }));
              }}

          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                  onClick={() => handleEditSprint(sprint)}
              >
                Edit sprint
              </DropdownMenuItem>
              <DropdownMenuItem
                  onClick={() => handleChangeStatus(sprint)}
              >
                Change status
              </DropdownMenuItem>
              <DropdownMenuItem
                  onClick={() => handleAddTask(sprint)}
              >
                Add tasks
              </DropdownMenuItem>
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
  onEditSprint,
  onChangeStatus,
  onAddTask,
}: {
  title: string;
  sprints: SprintCards[];
  onToggleTask: (sprintId: number, taskId: number) => void;
  onEditSprint: (sprint: SprintCards) => void;
  onChangeStatus: (sprint: SprintCards) => void;
  onAddTask: (sprint: SprintCards) => void;
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
                onEditSprint={onEditSprint}
                onChangeStatus={onChangeStatus}
                onAddTask={onAddTask}
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
