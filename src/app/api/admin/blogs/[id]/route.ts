import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

// Schema for Blog Post Update
const blogPostUpdateSchema = z.object({
    title: z.string().optional(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format").optional(),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    coverImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
    tags: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-ignore
        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const post = await prisma.blogPost.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-ignore
        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = blogPostUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors },
                { status: 400 }
            );
        }

        const data = validation.data;

        // Check slug uniqueness if updating slug
        if (data.slug) {
            const existingPost = await prisma.blogPost.findUnique({
                where: { slug: data.slug },
            });

            if (existingPost && existingPost.id !== params.id) {
                return NextResponse.json(
                    { error: "Slug already exists" },
                    { status: 409 }
                );
            }
        }

        const currentPost = await prisma.blogPost.findUnique({
            where: { id: params.id }
        });

        let publishedAt = currentPost?.publishedAt;
        if (data.status === "PUBLISHED" && currentPost?.status !== "PUBLISHED") {
            publishedAt = new Date();
        }

        const post = await prisma.blogPost.update({
            where: { id: params.id },
            data: {
                ...data,
                publishedAt
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error updating blog post:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-ignore
        if (!session || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.blogPost.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
