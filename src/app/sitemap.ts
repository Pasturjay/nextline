import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || "https://nexaline.com";

    // Dynamic Routes: Blog Posts
    let blogUrls: any[] = [];
    try {
        const posts = await prisma.blogPost.findMany({
            where: { status: "PUBLISHED" },
            select: { slug: true, updatedAt: true },
        });

        blogUrls = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch (e) {
        console.error("Sitemap Blog fetch error:", e);
    }

    // Dynamic Routes: Jobs
    let jobUrls: any[] = [];
    try {
        const jobs = await prisma.job.findMany({
            where: { status: "OPEN" },
            select: { id: true, postedAt: true, updatedAt: true },
        });

        jobUrls = jobs.map((job) => ({
            url: `${baseUrl}/careers/${job.id}`,
            lastModified: job.updatedAt,
            changeFrequency: "daily" as const,
            priority: 0.7,
        }));
    } catch (e) {
        console.error("Sitemap Job fetch error:", e);
    }

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
