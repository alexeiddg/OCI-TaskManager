"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {toast} from "sonner";
import {z} from "zod";
import {useIsMobile} from "@/hooks/use-mobile";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Task, TaskModel} from "@/lib/types/DTO/model/Task";
import {Separator} from "@/components/ui/separator";
import {fetchTasksByUserId} from "@/server/api/task/getTask";
import {useSession} from "next-auth/react";
import {toggleFavorite} from "@/server/api/task/toggleFavorite";
import {FavoriteButton} from "@/components/ui/FavoriteButton";
import {apiCompleteTask, apiCopyTask, apiDeleteTask} from "@/server/helpers/data-table-helpers";
import {TaskStatus} from "@/lib/types/enums/TaskStatus";
import {TaskAddModal} from "@/components/create-task-modal";
import {createTaskRequest} from "@/server/api/task/createTask";
import {fetchTaskDeps} from "@/server/api/task/createTaskHelpers";
import type {CreateTaskFormValues} from "@/lib/types/DTO/setup/TaskCreationSchema";

/**
 * separate component for the drag handle
 **/
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}



/**
 * Columns for data table
 **/
const columns: ColumnDef<z.infer<typeof Task>>[] = [
  /* ─────────── drag / checkbox ─────────── */
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableHiding: false,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  /* ─────────── task core fields ─────────── */
  {
    accessorKey: "taskName",
    header: "Task",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "taskType",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5 capitalize">
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <Badge
            variant="outline"
            className="px-1.5 capitalize flex items-center gap-1"
        >
          {row.original.status === "DONE" ? (
              <IconCircleCheckFilled className="size-4 fill-green-500 dark:fill-green-400" />
          ) : (
              <IconLoader className="size-4" />
          )}
          {row.original.status?.replace("_", " ") ?? "Unknown"}
        </Badge>
    ),
  },
  {
    accessorKey: "taskPriority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge
        className="px-1.5 capitalize"
        variant={
          row.original.priority === "HIGH"
            ? "destructive"
            : row.original.priority === "MEDIUM"
              ? "secondary"
              : "outline"
        }
      >
        {row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: "storyPoints",
    header: () => <div className="text-center w-full">SP</div>,
    cell: ({ row }) => (
      <div className="text-center w-full">{row.original.storyPoints}</div>
    ),
  },
  {
    accessorKey: "assignedToUsername",
    header: "Assigned To",
    cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row.original.assignedToUsername ?? "—"}
        </div>
    ),
  },
  {
    header: "Sprint",
    cell: ({ row }) => <div>{row.original.sprintName ?? "—"}</div>,
  },
  {
    accessorKey: "dueDate",
    header: "Due",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {new Date(row.original.dueDate).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "blocked",
    header: "Blocked",
    cell: ({ row }) =>
      row.original.blocked ? (
        <Badge variant="destructive">Yes</Badge>
      ) : (
        <Badge variant="outline">No</Badge>
      ),
  },
  {
    id: "favorite",
    header: () => <span className="sr-only">Favorite</span>,
    cell: ({ row, table }) => {
      const task = row.original;
      const { toggleFavorite } = table.options.meta!;

      return (
          <FavoriteButton
              isFavorite={task.favorite ?? false}
              onToggle={() => toggleFavorite(task.id)}
          />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const task = row.original;
      const {
        toggleFavorite,
        completeTask,
        deleteTask,
        copyTask,
      } = table.options.meta!;

      return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                  variant="ghost"
                  className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                  size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => completeTask(task.id)}>
                {task.status === "DONE" ? "Re-open" : "Complete"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyTask(task)}>
                Make a copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleFavorite(task.id)}>
                {task.favorite ? "Unfavorite" : "Favorite"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      );
    },
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof Task>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable() {
  const [data, setData] = React.useState<TaskModel[]>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const statusCounts = React.useMemo(() => {
    const c = { ALL: data.length, TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    data.forEach((t) => {
      c[t.status] += 1;
    });
    return c;
  }, [data]);

  const statusValues = ["ALL", "TODO", "IN_PROGRESS", "DONE"] as const;
  const [currentTab, setCurrentTab] =
    React.useState<(typeof statusValues)[number]>("ALL");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      toggleFavorite: handleToggleFavorite,
      completeTask: handleComplete,
      deleteTask: handleDelete,
      copyTask: handleCopy,
    },
  });

  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string }[]>([]);
  const [sprints, setSprints] = useState<{ id: number; sprintName: string }[]>([]);
  const { data: session } = useSession();
  const userId = Number(session?.user?.id)

  useEffect(() => {
    if (!userId) return;
    fetchTasksByUserId(userId)
        .then((tasks) => setData(tasks))
        .catch((err) => console.error("Failed to load tasks:", err))
        .finally(() => setLoading(false));
  }, [userId]);

  // Fetch team members and sprints for task creation
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  function handleToggleFavorite(taskId: number) {
    if (!userId) return;

    const task = data.find((t) => t.id === taskId);
    if (!task) return;

    const newFavoriteState = !task.favorite;

    // Optimistically update UI
    setData((prev) =>
        prev.map((t) =>
            t.id === taskId ? { ...t, favorite: newFavoriteState } : t
        )
    );

    toggleFavorite(userId, taskId, newFavoriteState)
        .then(() => {
          toast.success(`Task ${newFavoriteState ? "added to" : "removed from"} favorites`);
        })
        .catch((err) => {
          // Rollback on error
          setData((prev) =>
              prev.map((t) =>
                  t.id === taskId ? { ...t, favorite: !newFavoriteState } : t
              )
          );
          toast.error("Failed to update favorite");
          console.error(err);
        });
  }

  /* ---------- COMPLETE / REOPEN ---------- */
  function handleComplete(taskId: number) {
    setData(prev =>
        prev.map(t =>
            t.id === taskId
                ? {
                  ...t,
                  status: t.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE,
                  completedAt:
                      t.status === TaskStatus.DONE ? null : new Date().toISOString(),
                }
                : t,
        ),
    );

    apiCompleteTask(taskId).catch(err => {
      // rollback
      setData(prev => prev.map(t => (t.id === taskId ? { ...t, status: t.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE } : t)));
      console.error(err);
      toast.error("Could not update status");
    });
  }

  /* ---------- DELETE ---------- */
  function handleDelete(taskId: number) {
    const snapshot = data;
    setData(prev => prev.filter(t => t.id !== taskId));

    apiDeleteTask(taskId).catch(err => {
      setData(snapshot);
      console.error(err);
      toast.error("Delete failed");
    });
  }

  /* ---------- COPY ---------- */
  async function handleCopy(task: TaskModel) {
    try {
      const clone = await apiCopyTask(task, userId);
      setData(prev => [clone, ...prev]);
    } catch (err) {
      console.error(err);
      toast.error("Copy failed");
    }
  }

  /* ---------- CREATE TASK ---------- */
  const handleTaskCreate = async (taskData: CreateTaskFormValues): Promise<void> => {
    try {
      const createdTask = await createTaskRequest(taskData);
      // Refresh the task list after creating a new task
      if (userId) {
        fetchTasksByUserId(userId)
          .then((tasks) => setData(tasks))
          .catch((err) => console.error("Failed to load tasks:", err));
      }
      toast.success("Task created successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
      return Promise.reject(error);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center py-12">
          <IconLoader className="animate-spin size-6 text-muted-foreground" />
        </div>
    );
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={(val) => {
        setCurrentTab(val as typeof currentTab);
        if (val === "ALL") {
          table.resetColumnFilters();
        } else {
          table.setColumnFilters([{ id: "status", value: val }]);
        }
      }}
      className="flex flex-col gap-6 w-full"
    >
      {/* ------- header bar ------- */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        {/* view selector (mobile) */}
        <Label htmlFor="status-selector" className="sr-only">
          Status filter
        </Label>
        <Select
          value={currentTab}
          onValueChange={(val) => {
            setCurrentTab(val as typeof currentTab);
            if (val === "ALL") {
              table.resetColumnFilters();
            } else {
              table.setColumnFilters([{ id: "status", value: val }]);
            }
          }}
        >
          <SelectTrigger
            id="status-selector"
            size="sm"
            className="flex w-fit @4xl/main:hidden"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusValues.map((st) => (
              <SelectItem key={st} value={st}>
                {st === "ALL" ? "All Tasks" : st.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* status tabs (desktop) */}
        <TabsList className="hidden @4xl/main:flex **:data-[slot=badge]:px-1">
          {statusValues.map((st) => (
            <TabsTrigger key={st} value={st}>
              {st === "ALL" ? "All Tasks" : st.replace("_", " ")}{" "}
              <Badge variant="secondary">{statusCounts[st]}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* right‑hand controls */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(!!v)}
                    className="capitalize"
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTaskModalOpen(true)}
          >
            <IconPlus />
            <span className="hidden lg:inline">Create New</span>
          </Button>
        </div>
      </div>

      {/* ------- table ------- */}
      <TabsContent
        value={currentTab}
        forceMount
        className="px-4 lg:px-6 flex flex-col gap-4"
      >
        <div className="border rounded-lg overflow-hidden">
          <DndContext
            sensors={sensors}
            id={sortableId}
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id} colSpan={h.colSpan}>
                        {h.isPlaceholder
                          ? null
                          : flexRender(
                              h.column.columnDef.header,
                              h.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((r) => (
                      <DraggableRow key={r.id} row={r} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center h-24"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>

      {/* Task Creation Modal */}
      <TaskAddModal
        open={isTaskModalOpen}
        onOpenChange={(open) => {
          setIsTaskModalOpen(open);
        }}
        onSubmit={handleTaskCreate}
        sprints={sprints}
        users={teamMembers}
        currentUser={session?.user ? { id: session.user.id, name: session.user.name || "Current User" } : { id: "0", name: "Current User" }}
        session={session}
      />
    </Tabs>
  );
}

function TableCellViewer({ item }: { item: z.infer<typeof Task> }) {
  const isMobile = useIsMobile();

  return (
      <Drawer direction={isMobile ? "bottom" : "right"}>
        {/* ---------- trigger (the cell link) ---------- */}
        <DrawerTrigger asChild>
          <Button variant="link" className="text-foreground w-fit px-0 text-left">
            {item.taskName}
          </Button>
        </DrawerTrigger>

        {/* ---------- drawer panel ---------- */}
        <DrawerContent>
          <DrawerHeader className="gap-1">
            <DrawerTitle>{item.taskName}</DrawerTitle>
            <DrawerDescription>
              Quick‑edit details for this task
            </DrawerDescription>
          </DrawerHeader>

          {/* body */}
          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            <form className="flex flex-col gap-4">
              {/* ---- Task basics ---- */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    className="min-h-[100px] resize-y rounded-md border p-2"
                    defaultValue={item.taskDescription}
                />
              </div>

              {/* ---- Type & Status ---- */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="taskType">Type</Label>
                  <Select defaultValue={item.type}>
                    <SelectTrigger id="taskType">
                      <SelectValue placeholder="Type"/>
                    </SelectTrigger>
                    <SelectContent>
                      {["BUG", "FEATURE", "IMPROVEMENT"].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="taskStatus">Status</Label>
                  <Select defaultValue={item.status}>
                    <SelectTrigger id="taskStatus">
                      <SelectValue placeholder="Status"/>
                    </SelectTrigger>
                    <SelectContent>
                      {["TODO", "IN_PROGRESS", "DONE"].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace("_", " ")}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ---- Assignment & Priority ---- */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select defaultValue={item.assignedToUsername ?? ""}>
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder="Unassigned"/>
                    </SelectTrigger>
                    <SelectContent>
                      {["alice", "bob", "carol"].map((user) => (
                          <SelectItem key={user} value={user}>
                            {user}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue={item.priority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Priority"/>
                    </SelectTrigger>
                    <SelectContent>
                      {["LOW", "MEDIUM", "HIGH"].map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ---- Sprint & Story Points ---- */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sprint">Sprint</Label>
                  <Select defaultValue={String(item.sprintId)}>
                    <SelectTrigger id="sprint">
                      <SelectValue placeholder="Select Sprint"/>
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        {id: 1, name: "Sprint 1"},
                        {id: 2, name: "Sprint 2"},
                      ].map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.name}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="storyPoints">Story Points</Label>
                  <Input
                      type="number"
                      id="storyPoints"
                      defaultValue={item.storyPoints}
                      min={0}
                  />
                </div>
              </div>

              {/* ---- Due date & Completion ---- */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="dueDate">Due date</Label>
                  <Input
                      id="dueDate"
                      type="date"
                      defaultValue={item.dueDate?.slice(0, 10)}
                  />
                </div>
              </div>

              {/* ---- Blocked flag ---- */}
              <div className="flex items-center gap-2">
                <Checkbox
                    id="blocked"
                    defaultChecked={item.blocked}
                />
                <Label htmlFor="blocked">Blocked</Label>
              </div>
            </form>

            <Separator />
            <div className="flex flex-col gap-2">
              <Label className="text-base font-medium">Time Logged</Label>

              {/* Simulated log data (replace later with fetched logs) */}
              <div className="space-y-1 text-sm">
                {[{ user: "alice", hours: 2, date: "2025-04-19" }, { user: "bob", hours: 3.5, date: "2025-04-20" }].map((log, i) => (
                    <div key={i} className="flex justify-between text-muted-foreground border rounded-md p-2 bg-muted/40">
                      <span>{log.user}</span>
                      <span>{log.hours}h on {log.date}</span>
                    </div>
                ))}
              </div>

              {/* Add new log entry */}
              <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const input = form.elements.namedItem("logHours") as HTMLInputElement;
                    const hours = parseFloat(input.value);
                    if (!isNaN(hours)) {
                      console.log(`Log ${hours}hours to task ${item.id}`);
                      input.value = "";
                    }
                  }}
                  className="flex gap-2 mt-2"
              >
                <Input
                    name="logHours"
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="Log hours"
                    className="w-24"
                    required
                />
                <Button type="submit" variant="default">
                  Add
                </Button>
              </form>
            </div>

            <Separator />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>ID: {item.id}</p>
              <p>Created: {new Date(item.createdAt).toLocaleString()}</p>
              <p>Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "—"}</p>
              <p>Completed At: {item.completedAt ? new Date(item.completedAt).toLocaleString() : "—"}</p>
              <p>Created By ID: {item.createdByUsername ?? "—"}</p>
              <p>Active: {item.isActive ? "Yes" : "No"}</p>
            </div>
          </div>

          <DrawerFooter>
            <Button>Mark As Completed</Button>
            <Button variant="secondary">Save</Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
  );
}
