"use client";

import { useState, useEffect } from "react";
import { Loader2, Phone, MessageSquare, Hash, Clock, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface AnalyticsData {
    summary: {
        totalCalls: number;
        totalDuration: number;
        totalSms: number;
        activeNumbers: number;
    };
    recentActivity: any[];
}

export default function GeneralAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("/api/analytics");
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

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
    if (!data) return <div className="p-4 text-center text-muted-foreground">No data available</div>;

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return `${mins}m ${seconds % 60}s`;
    };

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Calls (30d)</CardTitle>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.totalCalls}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatDuration(data.summary.totalDuration)} total duration
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SMS Sent (30d)</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.totalSms}</div>
                        <p className="text-xs text-muted-foreground">Messages sent & received</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Numbers</CardTitle>
                        <Hash className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.summary.activeNumbers}</div>
                        <p className="text-xs text-muted-foreground">Currently active lines</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usage Trend</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Stable</div>
                        <p className="text-xs text-muted-foreground">Consistent activity</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Feed */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] w-full pr-4">
                        <div className="space-y-6">
                            {data.recentActivity.map((item, index) => {
                                const isCall = item.type === 'CALL';
                                const isInbound = item.direction === 'INBOUND';

                                return (
                                    <div key={item.id || index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${isCall ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                {isCall ? <Phone className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {isCall ? 'Voice Call' : 'SMS Message'}
                                                    <Badge variant="outline" className="ml-2 text-xs font-normal">
                                                        {item.direction}
                                                    </Badge>
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {isCall
                                                        ? `${formatDuration(item.duration || 0)} • via ${item.number?.phoneNumber}`
                                                        : `${item.body?.substring(0, 40)}${item.body?.length > 40 ? '...' : ''} • via ${item.number?.phoneNumber}`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {isInbound ? <ArrowDownLeft className="h-3 w-3 inline text-green-500 mr-1" /> : <ArrowUpRight className="h-3 w-3 inline text-blue-500 mr-1" />}
                                                {isInbound ? item.fromNumber : item.toNumber}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(item.createdAt), "MMM d, h:mm a")}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {data.recentActivity.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
