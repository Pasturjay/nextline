import { prisma } from "@/lib/prisma";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug },
    });

    if (!post) {
        return {
            title: "Post Not Found - NexaLine Blog",
        };
    }

    return {
        title: post.seoTitle || `${post.title} | NexaLine Blog`,
        description: post.seoDescription || post.excerpt || `Read more about ${post.title}`,
        keywords: post.tags,
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || "",
            images: post.coverImage ? [post.coverImage] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug },
    });

    if (!post || post.status !== "PUBLISHED") {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="container mx-auto px-4">
                <Button variant="ghost" asChild className="mb-8">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>
                </Button>

                <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                    {/* Header */}
                    <div className="space-y-6 text-center">
                        <div className="flex justify-center gap-2">
                            {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
                            </div>
                            {/* Author placeholder - could be enhanced with actual User relation */}
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                NexaLine Team
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    {post.coverImage && (
                        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="prose dark:prose-invert max-w-none prose-lg text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>

                    {/* Share/Footer */}
                    <div className="flex justify-center pt-8 border-t dark:border-slate-800">
                        <Button variant="outline" className="gap-2">
                            <Share2 className="h-4 w-4" />
                            Share this article
                        </Button>
                    </div>
                </article>
            </div>
        </div>
    );
}
