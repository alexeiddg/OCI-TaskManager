"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createUser } from "@/services/userService";
import Link from "next/link";

export default function SignUpPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const usernameFromQuery = searchParams.get("username") || "";

    const [name, setName] = useState("");
    const [username, setUsername] = useState(usernameFromQuery);
    const [role, setRole] = useState("DEVELOPER");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleSignUp = async () => {
        if (!name.trim() || !username.trim()) {
            setMessage({ text: "Please fill out all fields.", type: "error" });
            return;
        }

        setMessage({ text: "", type: "" });
        setLoading(true);

        const newUser = await createUser(name, username, role);

        if (newUser) {
            setMessage({ text: "User created successfully!", type: "success" });
            setTimeout(() => {
                router.push("/dashboard"); // Redirect to dashboard
            }, 2000);
        } else {
            setMessage({ text: "Failed to create user. Please try again.", type: "error" });
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--oracle-light-gray)]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">

                {/* Success/Error Message Banner */}
                {message.text && (
                    <div
                        className={`absolute top-0 left-0 right-0 px-4 py-2 text-center text-white font-semibold ${
                            message.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <h1 className="text-2xl font-bold text-[var(--oracle-dark)] text-center mb-6 mt-8">
                    Complete Your Signup
                </h1>

                {/* Full Name */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Username */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Username</label>
                    <input
                        type="text"
                        placeholder="Choose a username"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Role Selection */}
                <div className="flex flex-col mb-4">
                    <label className="text-[var(--oracle-dark-gray)] font-medium">Choose Role</label>
                    <select
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="DEVELOPER">Developer</option>
                        <option value="MANAGER">Manager</option>
                    </select>
                </div>

                {/* Main Sign-Up Button */}
                <button
                    className="bg-[var(--oracle-red)] hover:bg-[var(--oracle-dark)] text-white font-bold py-2 px-4 rounded-md w-full"
                    onClick={handleSignUp}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Sign Up"}
                </button>

                {/* Redirect to Login */}
                <div className="text-center mt-4">
                    <p className="text-[var(--oracle-dark)] text-sm">Already have an account?</p>
                    <Link href="/" className="text-[var(--oracle-red)] underline text-sm">
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
