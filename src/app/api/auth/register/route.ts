import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import * as z from "zod";

const userSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required").min(8, "Password must have than 8 characters"),
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, firstName, lastName } = userSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { user: null, message: "User with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                passwordHash: hashedPassword,
                accountType: 'INDIVIDUAL',
                role: 'USER',
            },
        });

        // Remove password from response
        const { passwordHash, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            { user: userWithoutPassword, message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid input", errors: (error as any).errors },
                { status: 400 }
            );
        }

        console.error("Registration Error Details:", error);
        return NextResponse.json(
            {
                message: "Something went wrong during registration",
                error: process.env.NODE_ENV === "development" ? (error as any).message : undefined
            },
            { status: 500 }
        );
    }
}
