"use client";

import { useState } from "react";
import Link from "next/link";
import { Task } from "@/model/Task";

export default function CreateTaskPage() {
    const [task, setTask] = useState<Task>({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "PENDING",
        projectId: 1, // Placeholder (will be dynamic later)
        teamId: 1, // Placeholder (will be dynamic later)
        assignedTo: undefined,
        taskType: "FEATURE",
        storyPoints: 1,
        dueDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--oracle-light-gray)]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-[var(--oracle-dark)] text-center mb-6">
                    Create New Task
                </h1>

                {/* Task Title */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter task title"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        value={task.title}
                        onChange={handleChange}
                    />
                </div>

                {/* Task Description */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Enter task description"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        value={task.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Priority */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Priority</label>
                    <select
                        name="priority"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md"
                        value={task.priority}
                        onChange={handleChange}
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>

                {/* Task Type */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Task Type</label>
                    <select
                        name="taskType"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md"
                        value={task.taskType}
                        onChange={handleChange}
                    >
                        <option value="BUG">Bug</option>
                        <option value="FEATURE">Feature</option>
                        <option value="IMPROVEMENT">Improvement</option>
                    </select>
                </div>

                {/* Story Points */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Story Points</label>
                    <input
                        type="number"
                        name="storyPoints"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        value={task.storyPoints}
                        onChange={handleChange}
                    />
                </div>

                {/* Due Date */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        value={task.dueDate}
                        onChange={handleChange}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                    <Link href="/dashboard">
                        <button className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md">
                            Cancel
                        </button>
                    </Link>
                    <button
                        className="bg-[var(--oracle-red)] hover:bg-[var(--oracle-dark)] text-white px-4 py-2 rounded-md"
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
}
