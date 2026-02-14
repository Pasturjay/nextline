import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User } from "lucide-react";

export const metadata: Metadata = {
    title: "NexaLine Blog | Insights & Updates",
    description: "Stay updated with the latest news, product releases, and insights from the NexaLine team.",
};

export default async function BlogPage() {
    const posts = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">NexaLine Blog</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Insights, updates, and stories from our team.
                    </p>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                            <p className="text-muted-foreground">Check back soon for our first update.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                                    <Card className="h-full flex flex-col hover:shadow-lg transition-all border-slate-200 dark:border-slate-800 hover:border-blue-500/50">
                                        {post.coverImage && (
                                            <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-900">
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <CardHeader>
                                            <div className="flex gap-2 mb-2">
                                                {post.tags.slice(0, 2).map(tag => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <CardTitle className="group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </CardTitle>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col justify-between">
                                            <p className="text-muted-foreground line-clamp-3 mb-4 text-sm">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center text-blue-600 text-sm font-medium mt-auto group-hover:translate-x-1 transition-transform">
                                                Read Article
                                                <ArrowRight className="ml-1 h-3 w-3" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
