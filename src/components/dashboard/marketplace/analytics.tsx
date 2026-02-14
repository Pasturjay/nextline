"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Phone, MessageSquare, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'; // Assumed installed or skip

interface AnalyticsSummary {
    totalSpent: number;
    activeCampaigns: number;
    totalCalls: number;
    totalSms: number;
    answeredRate: number;
}

export default function CampaignAnalytics() {
    const [data, setData] = useState<{ summary: AnalyticsSummary, recentActivity: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("/api/market/analytics");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!data) return <div>No data available</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${Number(data.summary.totalSpent).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Lifetime marketplace spend</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.totalCalls}</div>
                        <p className="text-xs text-muted-foreground text-green-500">
                            {data.summary.answeredRate.toFixed(1)}% Answer Rate
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SMS Sent</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.totalSms}</div>
                        <p className="text-xs text-muted-foreground"> across active campaigns</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.activeCampaigns}</div>
                        <p className="text-xs text-muted-foreground">Total bookings created</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {data.recentActivity.map((booking: any) => (
                            <div key={booking.id} className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Rental: {booking.listing.number.phoneNumber}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(booking.startDate), "MMM d")} - {format(new Date(booking.endDate), "MMM d, yyyy")}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">
                                    ${Number(booking.finalPrice).toFixed(2)}
                                </div>
                            </div>
                        ))}
                        {data.recentActivity.length === 0 && (
                            <div className="text-center text-muted-foreground py-4">No recent activity</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
