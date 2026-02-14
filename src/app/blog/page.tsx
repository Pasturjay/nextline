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
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">NexaLine Blog</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Stay tuned for our latest insights and updates.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-2xl mx-auto py-12">
                    <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
                    <p className="text-muted-foreground">We are preparing some exciting content for you. Check back later!</p>
                </div>
            </div>
        </div>
    );
}
