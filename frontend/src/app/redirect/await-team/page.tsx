'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import * as React from "react";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function AwaitTeamAssignment() {

    const { data: session, status } = useSession()
    const router = useRouter()

    if (status === 'unauthenticated' || !session?.user) {
        toast.warning('Please login first')
        router.replace('/login')
        return
    }

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
                    <CardTitle className="text-center pt-10">Awaiting Team Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <Progress value={25} className="h-2 w-full"/>
                    <p className="text-center text-sm font-semibold text-muted-foreground">
                        You are logged in as a Developer. Please wait for your manager to assign you to a team.
                    </p>
                    {session?.user?.email && (
                        <p className="text-sm text-center text-muted-foreground">
                            📥 Be sure to check <span className="font-semibold text-foreground">{session.user.email}</span> for an invitation!
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
