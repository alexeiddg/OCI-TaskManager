"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sprint } from "@/model/Sprint";
import { Project } from "@/model/Project";
import { createSprint, getProjects } from "@/services/sprintService";

export default function CreateSprintPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [message, setMessage] = useState({ text: "", type: "" });

    const [sprint, setSprint] = useState<Sprint>({
        sprintName: "",
        startDate: "",
        endDate: "",
        project: { projectId: 0, projectName: "", projectDesc: "", manager: { userId: 0, name: "", username: "" } },
    });

    // Fetch projects
    useEffect(() => {
        async function fetchData() {
            const projectList = await getProjects();
            setProjects(projectList);
        }
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSprint((prev) => ({ ...prev, [name]: value }));
    };

    const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const projectId = Number(e.target.value);
        const selectedProject = projects.find((proj) => proj.projectId === projectId);
        if (selectedProject) {
            setSprint((prev) => ({ ...prev, project: selectedProject }));
        }
    };

    const handleCreateSprint = async () => {
        if (!sprint.sprintName.trim() || !sprint.startDate || !sprint.endDate || sprint.project.projectId === 0) {
            setMessage({ text: "Please fill out all fields", type: "error" });
            return;
        }

        setMessage({ text: "", type: "" });

        // Convert dates to ISO format before sending the request
        const sprintData = {
            ...sprint,
            startDate: new Date(sprint.startDate).toISOString(), // Ensuring proper format
            endDate: new Date(sprint.endDate).toISOString()
        };

        const result = await createSprint(sprintData); // Pass modified sprint object

        if (result) {
            setMessage({ text: "Sprint created successfully!", type: "success" });
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } else {
            setMessage({ text: "Failed to create sprint. Try again.", type: "error" });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--oracle-light-gray)]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-[var(--oracle-dark)] text-center mb-6">Create New Sprint</h1>

                {/* Success/Error Banner */}
                {message.text && (
                    <div className={`text-center px-4 py-2 mb-4 font-semibold ${
                        message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Sprint Name */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Sprint Name</label>
                    <input
                        type="text"
                        name="sprintName"
                        placeholder="Enter sprint name"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        onChange={handleChange}
                    />
                </div>

                {/* Start Date */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        onChange={handleChange}
                    />
                </div>

                {/* End Date */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        onChange={handleChange}
                    />
                </div>

                {/* Select Project */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Select Project</label>
                    <select
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md"
                        onChange={handleProjectSelect}
                    >
                        <option value="0">Select a project</option>
                        {projects.map((proj) => (
                            <option key={proj.projectId} value={proj.projectId}>
                                {proj.projectName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateSprint}
                        className="bg-[var(--oracle-red)] hover:bg-[var(--oracle-dark)] text-white px-4 py-2 rounded-md"
                    >
                        Create Sprint
                    </button>
                </div>
            </div>
        </div>
    );
}
