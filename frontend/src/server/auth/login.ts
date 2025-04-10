import { signIn } from 'next-auth/react';
import { LoginRequest } from '@/lib/types/DTO/auth/LoginRequest';

export async function submitLoginForm(
    formData: FormData
): Promise<{ success: boolean; message?: string }> {
    const loginRequest: LoginRequest = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
    };

    const result = await signIn("credentials", {
        username: loginRequest.username,
        password: loginRequest.password,
        redirect: false,
    });

    console.log("🧪 Login result from signIn():", result);

    if (!result?.ok || result.error) {
        console.warn("Login failed:", result);
        return { success: false, message: result?.error ?? "Login failed" };
    }

    return { success: true };
}
