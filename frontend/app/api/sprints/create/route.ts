import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/api/v1/sprint";

export async function POST(req: Request) {
    try {
        const sprintData = await req.json();

        const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sprintData),
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to create sprint" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in sprint creation API:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");

    if (!projectId) {
        return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    try {
        const res = await fetch(`${BACKEND_URL}/project/${projectId}`);

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch sprints" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching sprints:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
