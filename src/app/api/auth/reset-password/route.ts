import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import * as z from "zod";

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token, email, password } = resetPasswordSchema.parse(body);
        const normalizedEmail = email.toLowerCase();

        // Verify token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: {
                token,
                email: normalizedEmail,
            },
        });

        if (!resetToken) {
            return NextResponse.json(
                { message: "Invalid token or email" },
                { status: 400 }
            );
        }

        // Check expiration
        if (new Date() > resetToken.expires) {
            // Delete expired token
            await prisma.passwordResetToken.delete({
                where: { id: resetToken.id },
            });
            return NextResponse.json(
                { message: "Token has expired" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { email },
            data: {
                passwordHash: hashedPassword,
            },
        });

        // Delete used token
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id },
        });

        return NextResponse.json(
            { message: "Password reset successful! You can now sign in." },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid input", errors: error.errors },
                { status: 400 }
            );
        }

        console.error("Reset Password Error:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
