"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    status: "OPEN" | "CLOSED" | "DRAFT";
    postedAt: string;
}

export default function JobsPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.role === 'ADMIN' || session?.user?.role === 'HR') {
            fetchJobs();
        } else if (session && !['ADMIN', 'HR'].includes(session.user.role)) {
            setIsLoading(false);
        }
    }, [session]);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/jobs");
            if (!res.ok) {
                if (res.status === 401) {
                    // Handled by role check
                    return;
                }
                throw new Error("Failed to fetch jobs");
            }
            const data = await res.json();
            setJobs(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load jobs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;

        try {
            const res = await fetch(`/api/admin/jobs/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete job");

            toast.success("Job deleted successfully");
            fetchJobs();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete job");
        }
    };

    if (!session || !['ADMIN', 'HR'].includes(session.user.role)) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <ShieldAlert className="h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Job Postings</h2>
                    <p className="text-muted-foreground">Manage open positions and job listings.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/admin/jobs/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Job
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Jobs</CardTitle>
                    <CardDescription>
                        List of all current job postings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : jobs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No jobs found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    jobs.map((job) => (
                                        <TableRow key={job.id}>
                                            <TableCell className="font-medium">{job.title}</TableCell>
                                            <TableCell>{job.department}</TableCell>
                                            <TableCell>{job.location}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{job.type.replace("_", " ")}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={job.status === "OPEN" ? "default" : "secondary"}>
                                                    {job.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/dashboard/admin/jobs/${job.id}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
