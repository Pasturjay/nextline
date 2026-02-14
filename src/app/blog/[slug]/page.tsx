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
    // Commented out Prisma fetch for build stabilization
    /*
    const { slug } = await params;
    let post = null;
    try {
        post = await prisma.blogPost.findUnique({
            where: { slug },
        });
    } catch (e) {
        console.error("Metadata fetch error:", e);
    }
    */
    const post: any = null;

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
    notFound();
}
