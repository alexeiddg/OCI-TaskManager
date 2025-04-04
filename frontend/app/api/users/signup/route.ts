import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/api/v1/user";

export async function POST(req: Request) {
    try {
        const userData = await req.json();

        const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to create user" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in user creation API:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
