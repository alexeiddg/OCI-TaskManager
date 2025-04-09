"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/types/enums/UserRole";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        username: "",
        password: "",
        email: "",
        role: "MANAGER" as UserRole,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const err = await res.text();
                setError(err || "Failed to create account");
                setLoading(false);
                return;
            }

            // Redirect after signup
            router.push("/");
        } catch (err) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 px-4">
            <h1 className="text-2xl font-bold mb-4">Create an account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    type="text"
                    placeholder="Full name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    value={form.username}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="DEVELOPER">Developer</option>
                    <option value="MANAGER">Manager</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>
        </div>
    );
}
