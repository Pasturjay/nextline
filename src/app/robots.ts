import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || "https://nexaline.com";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/dashboard/admin/", "/auth/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
