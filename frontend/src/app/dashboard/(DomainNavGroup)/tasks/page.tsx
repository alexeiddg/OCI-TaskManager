import { DataTable } from "@/components/data-table";
import data from "@/app/dashboard/data.json";

export default function tasksPage() {
  return (
    <div>
      <DataTable data={data} />
    </div>
  );
}
