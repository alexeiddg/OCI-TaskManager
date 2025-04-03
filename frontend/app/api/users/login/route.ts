import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/api/v1/user";

export async function POST(req: Request) {
    try {
        const { username } = await req.json();

        // Fetch user from the backend
        const res = await fetch(`${BACKEND_URL}/username/${encodeURIComponent(username)}`);

        if (!res.ok) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = await res.json();
        return NextResponse.json(user); // Send user data back to frontend
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
