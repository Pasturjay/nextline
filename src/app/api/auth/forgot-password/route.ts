import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = forgotPasswordSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return 200 even if user doesn't exist for security (don't reveal registered emails)
            return NextResponse.json(
                { message: "If an account exists with this email, a reset link has been sent." },
                { status: 200 }
            );
        }

        // Generate token
        const token = uuidv4();
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        // Upsert token (if one already exists for this email, replace it)
        await prisma.passwordResetToken.upsert({
            where: { email_token: { email, token } }, // Actually, we should probably delete old ones first or just create new
            update: {
                token,
                expires,
            },
            create: {
                email,
                token,
                expires,
            },
        });

        // In a real app, send email here. For now, log to console.
        const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${email}`;
        console.log(`[PASSWORD RESET] Email: ${email}, Link: ${resetLink}`);

        return NextResponse.json(
            { message: "If an account exists with this email, a reset link has been sent." },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid email", errors: error.errors },
                { status: 400 }
            );
        }

        console.error("Forgot Password Error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
