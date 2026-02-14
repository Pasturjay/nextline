import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

// Schema for Job Creation
const jobSchema = z.object({
    title: z.string().min(1, "Title is required"),
    department: z.string().min(1, "Department is required"),
    location: z.string().min(1, "Location is required"),
    type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"]),
    description: z.string().min(1, "Description is required"),
    requirements: z.string().min(1, "Requirements are required"),
    status: z.enum(["OPEN", "CLOSED", "DRAFT"]).optional(),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-ignore - role is added in session callback
        if (!session || !['ADMIN', 'HR'].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const jobs = await prisma.job.findMany({
            orderBy: { postedAt: "desc" },
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // @ts-ignore - role is added in session callback
        if (!session || !['ADMIN', 'HR'].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = jobSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors },
                { status: 400 }
            );
        }

        const {
            title,
            department,
            location,
            type,
            description,
            requirements,
            status,
        } = validation.data;

        const job = await prisma.job.create({
            data: {
                title,
                department,
                location,
                type,
                description,
                requirements,
                status: status || "OPEN",
            },
        });

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
