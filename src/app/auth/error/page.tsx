
import { Metadata } from 'next'

import { Button } from "@/components/ui/button"
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Authentication Error - NexaLine',
    description: 'Authentication Error',
}

export default async function AuthErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { error } = await searchParams

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-destructive">
                        Authentication Error
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {error ? `Error: ${error} ` : "An error occurred during authentication."}
                    </p>
                </div>
                {/* Replaced the old Link with the new structure */}
                <div className="mt-6 flex justify-center">
                    <Link href="/auth/signin">
                        <Button variant="outline">Back to Sign In</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
