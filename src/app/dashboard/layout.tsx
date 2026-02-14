import { DashboardHeader } from "@/components/layout/header"
import { DashboardSidebar } from "@/components/layout/sidebar"
import { Metadata } from "next"
import Link from "next/link"
import { WebPhone } from "@/components/dashboard/web-phone"

export const metadata: Metadata = {
    title: "Dashboard - NexaLine",
    description: "NexaLine Dashboard",
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <div className="flex h-screen overflow-hidden bg-slate-50/50 dark:bg-slate-950">
                {/* Desktop Sidebar */}
                <div className="hidden w-64 border-r bg-white dark:bg-slate-900 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        {/* Sidebar content now includes header */}
                        <div className="flex-1 overflow-auto">
                            <DashboardSidebar />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col flex-1 overflow-hidden relative w-full">
                    <DashboardHeader />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                    {/* Persistent Web Phone */}
                    <WebPhone />
                </div>
            </div>
        </>
    )
}
