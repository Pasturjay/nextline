import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Building2, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "Careers at NexaLine | Join Our Team",
    description: "Explore career opportunities at NexaLine. We are looking for talented individuals to join our mission of revolutionizing communication.",
};

export default async function CareersPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Join the NexaLine Team</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        We're currently growing our team. Check back for new opportunities soon!
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-2xl mx-auto py-12">
                    <h3 className="text-2xl font-bold mb-4">No Open Positions</h3>
                    <p className="text-muted-foreground">We are not currently hiring, but stay tuned for updates.</p>
                </div>
            </div>
        </div>
    );
}
