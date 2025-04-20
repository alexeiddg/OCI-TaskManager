export async function toggleFavorite(userId: number, taskId: number, favorite: boolean) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/task/toggle-favorite`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            taskId,
            favorite,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to toggle favorite");
    }
}
