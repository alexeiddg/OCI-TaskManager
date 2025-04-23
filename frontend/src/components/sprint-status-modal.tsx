"use client"

import {useEffect, useState} from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { SprintStatus } from "@/lib/types/enums/SprintStatus"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface Sprint {
    id: number
    sprintName: string
    status: SprintStatus
}

interface SprintStatusModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    sprint: Sprint
    onStatusChange: (sprintId: number, newStatus: SprintStatus) => Promise<void>
}

export function SprintStatusModal({ open, onOpenChange, sprint, onStatusChange }: SprintStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<SprintStatus>(sprint?.status || SprintStatus.PLANNING)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Reset selected status when sprint changes
    useEffect(() => {
        if (sprint) {
            setSelectedStatus(sprint.status)
        }
    }, [sprint])

    const handleStatusChange = async () => {
        if (!sprint || selectedStatus === sprint.status) {
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            await onStatusChange(sprint.id, selectedStatus)
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update sprint status:", error)
            setError("Failed to update sprint status. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const getStatusDescription = (status: SprintStatus): string => {
        switch (status) {
            case SprintStatus.PLANNING:
                return "Sprint is in planning phase. Tasks can be added and modified."
            case SprintStatus.ACTIVE:
                return "Sprint is currently active. Team is working on tasks."
            case SprintStatus.COMPLETED:
                return "Sprint has been completed successfully."
            case SprintStatus.CANCELLED:
                return "Sprint has been cancelled before completion."
            default:
                return ""
        }
    }

    const getStatusWarning = (currentStatus: SprintStatus, newStatus: SprintStatus): string | null => {
        if (currentStatus === SprintStatus.ACTIVE && newStatus === SprintStatus.PLANNING) {
            return "Moving from Active to Planning will reset progress tracking."
        }
        if (
            currentStatus === SprintStatus.COMPLETED &&
            (newStatus === SprintStatus.PLANNING || newStatus === SprintStatus.ACTIVE)
        ) {
            return "Reopening a completed sprint is not recommended. Consider creating a new sprint instead."
        }
        if (newStatus === SprintStatus.CANCELLED) {
            return "Cancelling a sprint cannot be undone easily. All tasks will need to be reassigned."
        }
        return null
    }

    const warning = sprint ? getStatusWarning(sprint.status, selectedStatus) : null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Change Sprint Status</DialogTitle>
                    <DialogDescription>Update the status of sprint: {sprint?.sprintName}</DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="py-4">
                    <RadioGroup
                        value={selectedStatus}
                        onValueChange={(value) => setSelectedStatus(value as SprintStatus)}
                        className="space-y-4"
                    >
                        {Object.values(SprintStatus).map((status) => (
                            <div key={status} className="flex items-start space-x-2 space-y-0">
                                <RadioGroupItem value={status} id={status} />
                                <div className="grid gap-1.5">
                                    <Label htmlFor={status} className="font-medium">
                                        {status.charAt(0) + status.slice(1).toLowerCase()}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{getStatusDescription(status as SprintStatus)}</p>
                                </div>
                            </div>
                        ))}
                    </RadioGroup>

                    {warning && (
                        <Alert className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Warning</AlertTitle>
                            <AlertDescription>{warning}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleStatusChange} disabled={isSubmitting || (sprint && selectedStatus === sprint.status)}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Status
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
