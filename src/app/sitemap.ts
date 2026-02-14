import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || "https://nexaline.com";

    // Dynamic Routes: Blog Posts
    const posts = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
    });

    const blogUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Dynamic Routes: Jobs
    const jobs = await prisma.job.findMany({
        where: { status: "OPEN" },
        select: { id: true, postedAt: true, updatedAt: true },
    });

    const jobUrls = jobs.map((job) => ({
        url: `${baseUrl}/careers/${job.id}`,
        lastModified: job.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.7,
    }));

    // Static Routes
    const staticRoutes = [
        "",
        "/about",
        "/features",
        "/pricing",
        "/contact",
        "/blog",
        "/careers",
        "/login",
        "/signup",
        "/company/faq",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: route === "" ? 1 : 0.9,
    }));

    return [...staticRoutes, ...blogUrls, ...jobUrls];
}
