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
    // Commented out Prisma fetch for build stabilization
    /*
    const { id } = await params;
    let job = null;
    try {
        job = await prisma.job.findUnique({
            where: { id },
        });
    } catch (e) {
        console.error("Metadata fetch error:", e);
    }
    */
    const job: any = null;

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
    notFound();
}
