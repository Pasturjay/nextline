import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogPage() {
    const posts = [
        {
            title: "The Future of CPaaS in 2026",
            excerpt: "How AI and programmability are reshaping the telecommunications landscape.",
            date: "Oct 12, 2025",
            readTime: "5 min read",
            category: "Industry Trends",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Introducing SMS 2.0: Rich Communication Services",
            excerpt: "Why traditional SMS is evolving and what it means for customer engagement.",
            date: "Sep 28, 2025",
            readTime: "4 min read",
            category: "Product Update",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Case Study: Scaling Global Support with Virtual Numbers",
            excerpt: "How TechCorp reduced support costs by 40% using NexaLine's virtual number API.",
            date: "Sep 15, 2025",
            readTime: "7 min read",
            category: "Case Study",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        The <span className="text-primary">NexaLine</span> Blog
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Insights, updates, and tutorials from the team building the future of communication.
                    </p>
                </section>

                <section className="container mx-auto px-4 mb-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        {posts.map((post, i) => (
                            <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                                <CardHeader>
                                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">{post.category}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                                </CardContent>
                                <CardFooter className="text-sm text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4" /> {post.date}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
}
