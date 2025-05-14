"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TaskData {
    id: string
    taskName: string
    developer: string
    estimatedHours: number
    actualHours: number
}

interface TaskHoursTableProps {
    data?: TaskData[]
}

const defaultData: TaskData[] = [
    {
        id: "1",
        taskName: "Realizar video de demo para Release Version 1",
        developer: "Cristobal Camarena",
        estimatedHours: 1,
        actualHours: 1,
    },
    {
        id: "2",
        taskName: "Implementar dashboard de KPIs por desarrollador",
        developer: "Josue Galindo",
        estimatedHours: 3,
        actualHours: 3,
    },
    {
        id: "3",
        taskName: "Desarrollo de API para métricas de desarrolladores",
        developer: "Josue Galindo",
        estimatedHours: 4,
        actualHours: 3,
    },
    {
        id: "4",
        taskName: "Dashboard de KPIs de sprint",
        developer: "Paulina Gonzalez",
        estimatedHours: 3,
        actualHours: 3,
    },
]

export function TaskHoursTable({ data = defaultData }: TaskHoursTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[40%]">Task Name</TableHead>
                    <TableHead className="w-[25%]">Developer</TableHead>
                    <TableHead className="text-right">Estimated Hours</TableHead>
                    <TableHead className="text-right">Actual Hours</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((task) => (
                    <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.taskName}</TableCell>
                        <TableCell>{task.developer}</TableCell>
                        <TableCell className="text-right">{task.estimatedHours}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                {task.actualHours}
                                {task.actualHours < task.estimatedHours && (
                                    <Badge className="bg-chart-2 hover:bg-chart-2/80">Under</Badge>
                                )}
                                {task.actualHours > task.estimatedHours && (
                                    <Badge className="bg-chart-5 hover:bg-chart-5/80">Over</Badge>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
