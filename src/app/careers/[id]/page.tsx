import { prisma } from "@/lib/prisma";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Building2, Clock, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    let job = null;
    try {
        job = await prisma.job.findUnique({
            where: { id },
        });
    } catch (e) {
        console.error("Metadata fetch error:", e);
    }

    if (!job) {
        return {
            title: "Job Not Found - NexaLine",
        };
    }

    return {
        title: `${job.title} at NexaLine | Careers`,
        description: `Join NexaLine as a ${job.title}. ${job.location} - ${job.type.replace("_", " ")}.`,
    };
}

export default async function JobDetailPage({ params }: Props) {
    const { id } = await params;
    let job = null;
    try {
        job = await prisma.job.findUnique({
            where: { id },
        });
    } catch (e) {
        console.error("Job detail fetch error:", e);
    }

    if (!job || job.status !== "OPEN") {
        notFound();
    }

    // Function to render text with newlines
    const renderContent = (content: string) => {
        return content.split("\n").map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="container mx-auto px-4">
                <Button variant="ghost" asChild className="mb-8">
                    <Link href="/careers">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Careers
                    </Link>
                </Button>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
                                <div className="flex flex-wrap gap-4 text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Building2 className="h-5 w-5" />
                                        {job.department}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-5 w-5" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-5 w-5" />
                                        {job.type.replace("_", " ")}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 min-w-[200px]">
                                <Button size="lg" className="w-full" asChild>
                                    <a href={`mailto:careers@nexaline.com?subject=Application for ${job.title}`}>
                                        Apply Now
                                    </a>
                                </Button>
                                <Button variant="outline" size="lg" className="w-full">
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </Button>
                            </div>
                        </div>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                            <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <section className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h2 className="text-2xl font-bold mb-6">About the Role</h2>
                                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                    {job.description}
                                </div>
                            </section>

                            <section className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                    {job.requirements}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-slate-900 text-white rounded-xl p-6">
                                <h3 className="text-lg font-bold mb-4">Why Join Us?</h3>
                                <ul className="space-y-3 text-slate-300 text-sm">
                                    <li>• Competitive salary and equity</li>
                                    <li>• Remote-first culture</li>
                                    <li>• Health, dental, and vision insurance</li>
                                    <li>• Unlimited PTO</li>
                                    <li>• Latest hardware of your choice</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
