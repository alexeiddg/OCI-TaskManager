import { SignupRequest } from "@/lib/types/DTO/auth/SignupRequest";
import { UserRole } from "@/lib/types/enums/UserRole";

export async function submitSignupForm(
    formData: FormData,
    endpoint: string
): Promise<{ success: boolean; message?: string }> {
    const signupRequest: SignupRequest = {
        name: formData.get("name") as string,
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role: formData.get("role") as UserRole,
    };

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupRequest),
    });

    if (!res.ok) {
        const message = await res.text();
        return { success: false, message };
    }

    const responseBody = await res.json();
    console.log("Signup response body:", responseBody); //TODO: Remove this for release
    return {
        success: true,
        message: responseBody.message,
    };
}
