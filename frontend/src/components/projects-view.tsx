"use client";

import * as React from "react";
import {
  CalendarClock,
  Clock,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  StarOff,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchProjectsByTeamAndUser } from "@/server/api/project/getProjects";
import { toggleFavoriteProject } from "@/server/api/project/favoriteProject";
import type { ProjectDto } from "@/lib/types/DTO/model/ProjectDto";

export function ProjectsView() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filter, setFilter] = React.useState<
    "all" | "favorite" | "active" | "completed"
  >("all");
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const teamId = session?.user?.teamId;
  const userId = session?.user?.id;

  useEffect(() => {
    if (!teamId || !userId) return;
    fetchProjectsByTeamAndUser(Number(teamId), Number(userId))
      .then(setProjects)
      .catch((err) => console.error("Error loading projects:", err));
  }, [teamId, userId]);

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "favorite" && project.favorite) ||
        (filter === "active" && project.isActive) ||
        (filter === "completed" && project.progress === 100);

      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, filter]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your team projects
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 w-full sm:w-auto">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "favorite" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("favorite")}
            >
              Favorites
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: ProjectDto) => (
            <ProjectCard
              key={project.id}
              project={project}
              onToggleFavorite={async () => {
                if (!userId) return;
                try {
                  const isNowFavorite = await toggleFavoriteProject(
                    project.id,
                    Number(userId),
                  );
                  setProjects((prev) =>
                    prev.map((p) =>
                      p.id === project.id
                        ? { ...p, favorite: isNowFavorite }
                        : p,
                    ),
                  );
                } catch (err) {
                  console.error("Failed to toggle favorite:", err);
                }
              }}
            />
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery
                  ? `No projects matching "${searchQuery}"`
                  : "Try creating a new project or changing filters"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({
  project,
  onToggleFavorite,
}: {
  project: ProjectDto;
  onToggleFavorite: () => void;
}) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <div className="flex items-center">
            <h3 className="font-semibold text-lg line-clamp-1">
              {project.projectName}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-6 w-6 text-muted-foreground hover:text-chart-4"
              onClick={onToggleFavorite}
            >
              {project.favorite ? (
                <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
              <span className="sr-only">
                {project.favorite
                  ? "Remove from favorites"
                  : "Add to favorites"}
              </span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.projectDescription}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(project.progress * 100)}%</span>
          </div>
          <Progress
            value={project.progress * 100}
            className="h-2 bg-secondary [&>[data-role=indicator]]:bg-primary"
          />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
        <Separator className="mb-2" />

        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarClock className="mr-1 h-4 w-4" />
            <span>Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>{project.teamName}</span>
          </div>
        </div>

        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>
            Updated{" "}
            {project.updatedAt
              ? formatDate(project.updatedAt)
              : "No updates yet"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
