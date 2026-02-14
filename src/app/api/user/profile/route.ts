import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { z } from "zod";

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
});

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { firstName, lastName } = profileSchema.parse(body);

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                firstName,
                lastName
            }
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid input", errors: (error as any).errors }, { status: 400 });
        }
        console.error("Profile Update Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
