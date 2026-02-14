"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    publishedAt: string | null;
    createdAt: string;
}

export default function BlogsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/blogs");
            if (!res.ok) throw new Error("Failed to fetch posts");
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load blog posts");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const res = await fetch(`/api/admin/blogs/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete post");

            toast.success("Post deleted successfully");
            fetchPosts();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete post");
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "PUBLISHED": return "default"; // Greenish
            case "DRAFT": return "secondary"; // Gray
            case "ARCHIVED": return "outline";
            default: return "secondary";
        }
    };

    if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
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
                    <h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
                    <p className="text-muted-foreground">Manage your blog posts and content.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/admin/blogs/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Post
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Posts</CardTitle>
                    <CardDescription>
                        List of all blog posts (published, drafts, and archived).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Published Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : posts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No posts found. Create one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    posts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell className="font-medium">{post.title}</TableCell>
                                            <TableCell className="text-muted-foreground">/{post.slug}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(post.status) as any}>
                                                    {post.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                                            <Globe className="h-4 w-4 text-slate-500" />
                                                        </a>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/dashboard/admin/blogs/${post.id}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
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
