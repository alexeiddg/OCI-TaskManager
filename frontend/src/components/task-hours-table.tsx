"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { fetchTaskSummary } from "@/server/api/kpi/getTaskSummary"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface TaskData {
    id: string
    taskName: string
    developer: string
    estimatedHours: number
    actualHours: number
}

interface TaskHoursTableProps {
    data?: TaskData[]
    teamId?: number
}

export function TaskHoursTable({ data, teamId }: TaskHoursTableProps) {
    const { data: session } = useSession();
    const [tableData, setTableData] = useState<TaskData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            setTableData(data);
            setLoading(false);
            return;
        }

        const effectiveTeamId = teamId || Number(session?.user?.teamId);
        if (!effectiveTeamId) {
            setError("Team ID not available");
            setLoading(false);
            return;
        }

        fetchTaskSummary(effectiveTeamId)
            .then((taskData) => {
                const formattedData = taskData.map((task) => ({
                    id: task.id.toString(),
                    taskName: task.taskName,
                    developer: task.developerName,
                    estimatedHours: task.estimatedHours,
                    actualHours: task.actualHours,
                }));
                setTableData(formattedData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch task summary data:", err);
                setError("Failed to load task summary data");
                setLoading(false);
            });
    }, [data, teamId, session]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[40%]">Task Name</TableHead>
                    <TableHead className="w-[25%]">Developer</TableHead>
                    <TableHead className="text-center">Estimated Hours</TableHead>
                    <TableHead className="text-right">Actual Hours</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData.map((task) => (
                    <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.taskName}</TableCell>
                        <TableCell>{task.developer}</TableCell>
                        <TableCell className="text-center">{task.estimatedHours}</TableCell>
                        <TableCell className="text-center">
                            <div className="flex items-center justify-end gap-2">
                                {task.actualHours === 0 ? (
                                    "No logged Hours"
                                ) : (
                                    <>
                                        {task.actualHours}
                                        {task.actualHours < task.estimatedHours && (
                                            <Badge className="bg-chart-2 hover:bg-chart-2/80">Under</Badge>
                                        )}
                                        {task.actualHours > task.estimatedHours && (
                                            <Badge className="bg-chart-5 hover:bg-chart-5/80">Over</Badge>
                                        )}
                                        {task.actualHours === task.estimatedHours && (
                                            <Badge className="bg-chart-3 hover:bg-chart-3/80">Balanced</Badge>
                                        )}
                                    </>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
