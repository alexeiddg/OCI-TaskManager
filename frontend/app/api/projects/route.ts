import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/api/v1/project";

export async function GET() {
    try {
        const res = await fetch(BACKEND_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch projects" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
