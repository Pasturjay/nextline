
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    CreditCard,
    Key,
    Phone,
    Plane,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    MessageSquare,
    Plus,
    Globe,
    Zap,
    Shield
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardClient } from "./dashboard-client";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    // Fetch all data in parallel
    const [
        activeNumbersCount,
        activeRentalsCount,
        callCount,
        smsCount,
        apiKeysCount,
        recentNumbers,
        recentActivity
    ] = await Promise.all([
        prisma.virtualNumber.count({
            where: { userId: session.user.id, status: 'ACTIVE' }
        }),
        prisma.travelRental.count({
            where: { userId: session.user.id, status: 'ACTIVE' }
        }),
        prisma.callLog.count({
            where: { number: { userId: session.user.id } }
        }),
        prisma.smsLog.count({
            where: { number: { userId: session.user.id } }
        }),
        prisma.apiKey.count({
            where: { userId: session.user.id }
        }),
        prisma.virtualNumber.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: { phoneNumber: true, createdAt: true, country: true }
        }),
        prisma.apiKey.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: { name: true, createdAt: true }
        })
    ]);

    const totalApiUsage = callCount + smsCount;
    const isNewUser = activeNumbersCount === 0 && apiKeysCount === 0;

    // Calculate onboarding progress
    const onboardingSteps = [
        { done: true, label: "Account created", href: "#" },
        { done: apiKeysCount > 0, label: "API key generated", href: "/dashboard/developer/keys" },
        { done: activeNumbersCount > 0, label: "First number purchased", href: "/dashboard/buy-number" },
        { done: totalApiUsage > 0, label: "First API call made", href: "/docs/api" },
    ];
    const completedSteps = onboardingSteps.filter(s => s.done).length;
    const progressPercent = (completedSteps / onboardingSteps.length) * 100;

    return (
        <div className="flex-1 p-4 md:p-8 pt-6 space-y-8 bg-muted/5 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {session.user.name?.split(' ')[0] || 'User'}. Here's your infrastructure overview.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                        <Link href="/docs">Documentation</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/buy-number">
                            <Plus className="mr-2 h-4 w-4" /> Provision Number
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Onboarding Card (Only for new users) */}
            {isNewUser && (
                <div className="rounded-xl border bg-card p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp className="h-32 w-32 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">Getting Started</h3>
                                <p className="text-sm text-muted-foreground">Complete these steps to activate your account fully.</p>
                            </div>
                            <Badge variant="secondary" className="text-sm px-3 py-1">{Math.round(progressPercent)}%</Badge>
                        </div>
                        <Progress value={progressPercent} className="h-2 mb-6" />
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {onboardingSteps.map((step, idx) => {
                                const isClickable = !step.done && step.href !== "#";
                                const Content = (
                                    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${step.done ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'} ${isClickable ? 'hover:bg-muted hover:border-primary/30 cursor-pointer' : ''}`}>
                                        <div className={`p-1 rounded-full ${step.done ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span className={`text-sm font-medium ${step.done ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {step.label}
                                        </span>
                                        {isClickable && (
                                            <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground opacity-50" />
                                        )}
                                    </div>
                                );

                                if (isClickable) {
                                    return (
                                        <Link key={idx} href={step.href} className="block">
                                            {Content}
                                        </Link>
                                    );
                                }

                                return <div key={idx}>{Content}</div>;
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Active Numbers"
                    value={activeNumbersCount.toString()}
                    icon={Phone}
                    trend={activeNumbersCount > 0 ? "+ Active" : "No active numbers"}
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                />
                <StatsCard
                    title="API Usage"
                    value={totalApiUsage.toLocaleString()}
                    icon={Activity}
                    trend="Total calls & SMS"
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                />
                <StatsCard
                    title="Travel eSIMs"
                    value={activeRentalsCount.toString()}
                    icon={Plane}
                    trend="Active data plans"
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                />
                <StatsCard
                    title="API Keys"
                    value={apiKeysCount.toString()}
                    icon={Key}
                    trend="Active keys"
                    color="text-orange-500"
                    bg="bg-orange-500/10"
                />
            </div>

            {/* Bento Grid Layout */}
            <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">

                {/* Main Content Area (Quick Actions & Shortcuts) - Col Span 4 */}
                <div className="md:col-span-4 space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ActionCard
                            title="Buy Virtual Number"
                            description="Local, Mobile, & Toll-Free"
                            icon={Globe}
                            href="/dashboard/buy-number"
                            color="text-blue-600 dark:text-blue-400"
                        />
                        <ActionCard
                            title="Travel Data (eSIM)"
                            description="Global connectivity 150+ countries"
                            icon={Plane}
                            href="/dashboard/travel"
                            color="text-purple-600 dark:text-purple-400"
                        />
                        <ActionCard
                            title="Developer API"
                            description="Manage keys & Webhooks"
                            icon={Zap}
                            href="/dashboard/developer/keys"
                            color="text-amber-600 dark:text-amber-400"
                        />
                        <ActionCard
                            title="Billing & Usage"
                            description="Invoices, Top-ups & History"
                            icon={CreditCard}
                            href="/dashboard/billing"
                            color="text-pink-600 dark:text-pink-400"
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Documentation & Support</CardTitle>
                            <CardDescription>Resources to help you build with NexaLine</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-3">
                            <Link href="/docs/api" className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center">
                                <FileText className="h-6 w-6 mb-2 text-muted-foreground" />
                                <span className="text-sm font-medium">API Reference</span>
                            </Link>
                            <Link href="/docs/security" className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center">
                                <Shield className="h-6 w-6 mb-2 text-muted-foreground" />
                                <span className="text-sm font-medium">Security Guide</span>
                            </Link>
                            <Link href="/company/contact" className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center">
                                <MessageSquare className="h-6 w-6 mb-2 text-muted-foreground" />
                                <span className="text-sm font-medium">Contact Support</span>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Content (Activity) - Col Span 3 */}
                <div className="md:col-span-3 space-y-6">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest events on your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {(recentNumbers.length === 0 && recentActivity.length === 0) ? (
                                    <div className="text-center py-10 text-muted-foreground">
                                        <Activity className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                        <p>No recent activity</p>
                                    </div>
                                ) : (
                                    <>
                                        {recentNumbers.map((num) => (
                                            <div key={num.phoneNumber} className="flex">
                                                <div className="flex flex-col items-center mr-4">
                                                    <div className="w-[1px] h-full bg-border/50 mb-2"></div>
                                                    <div className="h-2 w-2 rounded-full bg-primary ring-4 ring-background"></div>
                                                    <div className="w-[1px] h-full bg-border/50 mt-2"></div>
                                                </div>
                                                <div className="pb-6">
                                                    <p className="text-sm font-medium leading-none">Purchased Number</p>
                                                    <p className="text-sm text-muted-foreground mt-1">{num.phoneNumber} ({num.country})</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{new Date(num.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {recentActivity.map((key) => (
                                            <div key={key.name + key.createdAt.getTime()} className="flex">
                                                <div className="flex flex-col items-center mr-4">
                                                    <div className="w-[1px] h-full bg-border/50 mb-2"></div>
                                                    <div className="h-2 w-2 rounded-full bg-blue-500 ring-4 ring-background"></div>
                                                    <div className="w-[1px] h-full bg-border/50 mt-2"></div>
                                                </div>
                                                <div className="pb-6">
                                                    <p className="text-sm font-medium leading-none">Created API Key</p>
                                                    <p className="text-sm text-muted-foreground mt-1">{key.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{new Date(key.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DashboardClient />
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, trend, color, bg }: any) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className={`p-2 rounded-full ${bg} ${color}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-muted-foreground">{trend}</div>
                </div>
            </CardContent>
        </Card>
    );
}

function ActionCard({ title, description, icon: Icon, href, color }: any) {
    return (
        <Link href={href}>
            <div className="group flex flex-col justify-between p-6 h-full rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300">
                <div className="mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-muted/50 group-hover:bg-background transition-colors ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
            </div>
        </Link>
    );
}

function FileText(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    )
}
