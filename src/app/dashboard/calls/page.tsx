"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface CallLog {
    id: string;
    direction: 'INBOUND' | 'OUTBOUND';
    status: string;
    fromNumber: string;
    toNumber: string;
    duration: number;
    recordingUrl: string | null;
    createdAt: string;
    number: {
        phoneNumber: string;
    };
}

export default function CallsPage() {
    const [calls, setCalls] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCalls();
    }, [page]);

    const fetchCalls = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/calls?page=${page}&limit=20`);
            if (res.ok) {
                const data = await res.json();
                setCalls(data.calls);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load call history");
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge>;
            case 'failed': return <Badge variant="destructive">Failed</Badge>;
            case 'busy': return <Badge variant="secondary">Busy</Badge>;
            case 'no-answer': return <Badge variant="secondary">No Answer</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getDirectionIcon = (direction: string, status: string) => {
        if (status === 'missed' || status === 'no-answer') return <PhoneMissed className="h-4 w-4 text-red-500" />;
        if (direction === 'INBOUND') return <PhoneIncoming className="h-4 w-4 text-green-500" />;
        return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Call History</h2>
                <p className="text-muted-foreground">View logs of all incoming and outgoing calls.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Calls</CardTitle>
                    <CardDescription>A list of your clear voice communication history.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>From / To</TableHead>
                                <TableHead>Via Number</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : calls.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No calls recorded yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                calls.map((call) => (
                                    <TableRow key={call.id}>
                                        <TableCell>
                                            {getDirectionIcon(call.direction, call.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {call.direction === 'INBOUND' ? call.fromNumber : call.toNumber}
                                                </span>
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    {call.direction.toLowerCase()}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {call.number.phoneNumber}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(call.createdAt), "MMM d, h:mm a")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-muted-foreground">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {formatDuration(call.duration)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {getStatusBadge(call.status)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Simple Pagination */}
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                        >
                            Previous
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
