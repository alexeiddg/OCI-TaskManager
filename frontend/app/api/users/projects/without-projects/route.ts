import { NextResponse } from "next/server";

const API_URL = "http://localhost:8080/api/v1/user/without-projects";

export async function GET() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch users" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
