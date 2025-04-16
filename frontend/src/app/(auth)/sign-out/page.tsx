"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SignOutPage() {
    useEffect(() => {
        signOut({ redirectTo: "/login" });
    }, []);

    toast.success("Please login again to load changes!");

    return (
        <div
            className="flex h-screen w-full items-center justify-center bg-gray-50"
            style={{
                backgroundImage:
                    "url('https://static.oracle.com/cdn/apex/21.1.0/themes/theme_42/1.6/images/rw/textures/texture-16.png')",
            }}
        >
            <Card className="w-full max-w-md mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Signing you out...</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                    <p className="text-center text-sm text-muted-foreground">
                        Please wait while we redirect you.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
