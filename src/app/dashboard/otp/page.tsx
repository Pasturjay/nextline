import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Phone, Clock, TrendingUp } from "lucide-react";
import { OtpClient } from "./otp-client";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function OtpPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/auth/signin");
    }

    // Get user's OTP usage (lifetime, not daily)
    const totalUsage = await prisma.virtualNumber.count({
        where: {
            userId: session.user.id,
            monthlyPrice: 0, // Free numbers
        }
    });

    // Get the OTP number if user has used it
    const otpNumber = await prisma.virtualNumber.findFirst({
        where: {
            userId: session.user.id,
            monthlyPrice: 0,
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            phoneNumber: true,
            createdAt: true,
        }
    });

    const freeLimit = 1;
    const hasUsedFree = totalUsage >= freeLimit;

    return (
        <div className="container py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Instant OTP Verification</h1>
                <p className="text-muted-foreground">
                    Get verification codes instantly at no cost - perfect for account verification and testing.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Free Trial</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{hasUsedFree ? '0' : '1'}</div>
                        <p className="text-xs text-muted-foreground">
                            {hasUsedFree ? 'Trial used' : 'Free verification available'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Number Type</CardTitle>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Shared</div>
                        <p className="text-xs text-muted-foreground">
                            Temporary verification only
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Want Private?</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$5/mo</div>
                        <p className="text-xs text-muted-foreground">
                            Get your own dedicated number
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main OTP Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                Get Verification Number
                                <Badge variant="default">FREE</Badge>
                            </CardTitle>
                            <CardDescription>
                                Shared temporary number for OTP verification - 1 free use
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <OtpClient
                        hasUsedFree={hasUsedFree}
                        currentNumber={otpNumber?.phoneNumber}
                    />
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-base">⚠️ Shared Number - Get Your Own!</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                        This OTP number is <strong>shared with other users</strong> and for temporary verification only.
                    </p>
                    <p>
                        <strong>Want a private, dedicated number?</strong> Starting at $5/month or $15 one-time for 30 days.
                    </p>
                    <p className="text-xs">
                        ✓ Your own number ✓ Unlimited use ✓ Private calls & SMS ✓ No sharing
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}
