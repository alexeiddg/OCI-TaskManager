"use client";

import "./globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/userService";

export default function Home() {
    const [username, setUsername] = useState("");
    const [isSignupMode, setIsSignupMode] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const router = useRouter();

    const handleProceed = async () => {
        if (!username.trim()) {
            setMessage({ text: "Please enter a username", type: "error" });
            return;
        }

        setMessage({ text: "", type: "" });

        if (isSignupMode) {
            router.push(`/users/signup?username=${encodeURIComponent(username)}`);
        } else {
            // Login Logic - Call API to check if the user exists
            const user = await loginUser(username);
            if (user) {
                // Save user session in localStorage
                localStorage.setItem("user", JSON.stringify(user));
                router.push("/dashboard");

                setMessage({ text: "Login successful!", type: "success" });
            } else {
                setMessage({ text: "User not found. Please sign up.", type: "error" });
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--oracle-light-gray)]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">

                {/* Notification Banner */}
                {message.text && (
                    <div
                        className={`absolute top-0 left-0 right-0 px-4 py-2 text-center text-white font-semibold ${
                            message.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <h1 className="text-2xl font-bold text-[var(--oracle-dark)] text-center mb-4">
                    Welcome to Oracle Task Manager
                </h1>

                {/* Username Input */}
                <div className="flex flex-col">
                    <label className="text-[var(--oracle-dark-gray)] font-medium mb-1">
                        {isSignupMode ? "Enter a New Username" : "Enter Your Username"}
                    </label>
                    <input
                        type="text"
                        placeholder="Username"
                        className="border border-[var(--oracle-dark-gray)] p-2 rounded-md focus:outline-[var(--oracle-red)]"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleProceed()} // Handle Enter Key
                    />
                </div>

                {/* Login & Signup Buttons */}
                <div className="flex flex-col mt-4 space-y-2">
                    <button
                        className="bg-[var(--oracle-red)] hover:bg-[var(--oracle-dark)] text-white font-bold py-2 px-4 rounded-md"
                        onClick={handleProceed}
                    >
                        {isSignupMode ? "Sign Up" : "Login"}
                    </button>
                </div>

                {/* Toggle Between Login & Signup */}
                <div className="text-center mt-4">
                    <p className="text-[var(--oracle-dark)] text-sm">
                        {isSignupMode ? "Already have an account?" : "Don't have an account?"}
                        <button
                            className="text-[var(--oracle-red)] underline ml-1"
                            onClick={() => setIsSignupMode(!isSignupMode)}
                        >
                            {isSignupMode ? "Login" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
