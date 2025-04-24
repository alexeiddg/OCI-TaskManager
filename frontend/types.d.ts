import { RowData } from "@tanstack/react-table";
import { TaskModel } from "@/lib/types/DTO/model/Task";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    toggleFavorite: (taskId: number) => void;
    completeTask: (taskId: number) => void;
    deleteTask: (taskId: number) => void;
    copyTask: (task: TaskModel) => void;
    updateTask: (updated: TaskModel) => void;
  }
}
