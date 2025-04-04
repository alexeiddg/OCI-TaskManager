import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:8080//api/v1/sprint";

const sprintId = "1";

export async function GET(req: Request) {
  try {
    const res = await fetch(
      `${BACKEND_URL}/${encodeURIComponent(sprintId)}/completion-rate`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Sprint completion rate not found" },
        { status: 404 }
      );
    }

    const sprintCompletionRate = await res.json();
    return NextResponse.json(sprintCompletionRate);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
