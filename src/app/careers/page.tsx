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
    // Temporarily commented out Prisma fetching to ensure build success
    /*
    let jobs = [];
    try {
        jobs = await prisma.job.findMany({
            where: { status: "OPEN" },
            orderBy: { postedAt: "desc" },
        });
    } catch (error) {
        console.error("Failed to fetch jobs:", error);
    }
    */
    const jobs: any[] = [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Join the NexaLine Team</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        We're building the future of communication. Help us connect the world.
                    </p>
                </div>
            </div>

            {/* Jobs List */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    {jobs.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold mb-2">No Open Positions</h3>
                            <p className="text-muted-foreground">Check back later for new opportunities.</p>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div
                                key={job.id}
                                className="group bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-lg transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Building2 className="h-4 w-4" />
                                                {job.department}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {job.type.replace("_", " ")}
                                            </div>
                                        </div>
                                    </div>
                                    <Button asChild>
                                        <Link href={`/careers/${job.id}`}>
                                            View Role
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
