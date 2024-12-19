"use client"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { getSession } from "@/lib/getSession"
import { redirect } from "next/navigation"

export  function SignInPage() {
    const session =  getSession()
    if (session?.user) redirect('/dashboard')

    return (
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Get Started</h1>
                </div>


                <Button type="submit" onClick={() => signIn("google")} variant="outline" className="w-full flex gap-2"
                >
                    Continue with Google
                </Button>

            </div>
        </div>
    )
}