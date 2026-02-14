"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    LayoutDashboard,
    Phone,
    MessageSquare,
    CreditCard,
    Settings,
    Users,
    Globe,
    BarChart3
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DashboardSidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { data: session } = useSession()

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Virtual Numbers",
            icon: Phone,
            href: "/dashboard/numbers",
            active: pathname?.startsWith("/dashboard/numbers"),
        },
        {
            label: "Messages",
            icon: MessageSquare,
            href: "/dashboard/messages",
            active: pathname?.startsWith("/dashboard/messages"),
        },
        {
            label: "Calls",
            icon: Phone,
            href: "/dashboard/calls",
            active: pathname?.startsWith("/dashboard/calls"),
        },
        {
            label: "Travel Numbers",
            icon: Globe,
            href: "/dashboard/travel",
            active: pathname?.startsWith("/dashboard/travel"),
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/dashboard/analytics",
            active: pathname?.startsWith("/dashboard/analytics"),
        },
        {
            label: "Billing",
            icon: CreditCard,
            href: "/dashboard/billing",
            active: pathname?.startsWith("/dashboard/billing"),
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
            active: pathname?.startsWith("/dashboard/settings"),
        },
    ]

    return (
        <div className={cn("pb-12 h-full bg-slate-50/50 dark:bg-slate-900/50", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <Link href="/" className="flex items-center gap-2 px-4 mb-6">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            N
                        </div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-600">
                            NexaLine
                        </h2>
                    </Link>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start transition-all duration-200",
                                    route.active
                                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className={cn("mr-2 h-4 w-4", route.active ? "text-blue-600 dark:text-blue-400" : "text-slate-500")} />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>

                {session?.user?.role === 'ADMIN' && (
                    <div className="px-3 py-2">
                        <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Admin
                        </h2>
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-800" asChild>
                                <Link href="/dashboard/users">
                                    <Users className="mr-2 h-4 w-4 text-slate-500" />
                                    Users
                                </Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-800" asChild>
                                <Link href="/dashboard/admin/jobs">
                                    <Users className="mr-2 h-4 w-4 text-slate-500" />
                                    Manage Jobs
                                </Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-800" asChild>
                                <Link href="/dashboard/admin/blogs">
                                    <Globe className="mr-2 h-4 w-4 text-slate-500" />
                                    Manage Blogs
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
