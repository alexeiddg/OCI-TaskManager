"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/model/Project";
import { User } from "@/model/User";
import { getAvailableDevelopers, getLoggedInUser, createProject } from "@/services/projectService";

export default function CreateProjectPage() {
    const router = useRouter();
    const [developers, setDevelopers] = useState<User[]>([]);
    const [selectedDevelopers, setSelectedDevelopers] = useState<User[]>([]);
    const [message, setMessage] = useState({ text: "", type: "" });

    const [project, setProject] = useState<Project>({
        projectName: "",
        projectDesc: "",
        manager: { userId: 0, name: "", username: "" },
        developers: [],
    });

    useEffect(() => {
        async function fetchData() {
            const availableDevelopers = await getAvailableDevelopers();
            if (availableDevelopers) setDevelopers(availableDevelopers);

            const loggedInUser = getLoggedInUser();
            if (loggedInUser) {
                setProject((prev) => ({
                    ...prev,
                    manager: { userId: loggedInUser.userId, name: loggedInUser.name, username: loggedInUser.username },
                }));
            } else {
                router.push("/"); // Redirect to login if no session found
            }
        }
        fetchData();
    }, [router]);

    const handleDeveloperToggle = (developer: User) => {
        setSelectedDevelopers((prev) =>
            prev.some((d) => d.userId === developer.userId)
                ? prev.filter((d) => d.userId !== developer.userId)
                : [...prev, developer]
        );
    };

    const handleCreateProject = async () => {
        if (!project.projectName.trim()) {
            setMessage({ text: "Project name is required", type: "error" });
            return;
        }

        const newProject = { ...project, developers: selectedDevelopers };

        setMessage({ text: "", type: "" });

        const result = await createProject(newProject);
        if (result) {
            setMessage({ text: "Project created successfully!", type: "success" });
            setTimeout(() => {
                router.push("/dashboard"); // Redirect to dashboard
            }, 2000);
        } else {
            setMessage({ text: "Failed to create project. Please try again.", type: "error" });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--oracle-light-gray)]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-[var(--oracle-dark)] text-center mb-6">
                    Create New Project
                </h1>

                {/* Success/Error Banner */}
                {message.text && (
                    <div className={`text-center px-4 py-2 mb-4 font-semibold ${
                        message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Project Name */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Project Name</label>
                    <input
                        type="text"
                        placeholder="Enter project name"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        onChange={(e) => setProject({ ...project, projectName: e.target.value })}
                    />
                </div>

                {/* Project Description */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Description</label>
                    <textarea
                        placeholder="Enter project description"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        onChange={(e) => setProject({ ...project, projectDesc: e.target.value })}
                    ></textarea>
                </div>

                {/* Manager Info (Auto-filled) */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Project Manager</label>
                    <input
                        type="text"
                        value={project.manager.name || ""}
                        disabled
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md bg-gray-200"
                    />
                </div>

                {/* Developers Selection */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Assign Developers</label>
                    <div className="border border-[var(--oracle-dark-gray)] p-2 rounded-md max-h-40 overflow-y-auto">
                        {developers.map((dev) => (
                            <div key={dev.userId} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedDevelopers.some((d) => d.userId === dev.userId)}
                                    onChange={() => handleDeveloperToggle(dev)}
                                    className="mr-2"
                                />
                                <span>{dev.name} ({dev.username})</span>
                            </div>
                        ))}
                    </div>
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
                        onClick={handleCreateProject}
                        className="bg-[var(--oracle-red)] hover:bg-[var(--oracle-dark)] text-white px-4 py-2 rounded-md"
                    >
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
}
