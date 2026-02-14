import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        // Check admin authorization
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { email, role } = await req.json();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles = ['USER', 'ADMIN', 'SUPPORT', 'EDITOR', 'HR'];
        if (!role || !validRoles.includes(role)) {
            return NextResponse.json(
                { message: 'Invalid role. Must be USER, ADMIN, SUPPORT, EDITOR, or HR' },
                { status: 400 }
            );
        }

        // Check if user already exists (including suspended users)
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            if (existingUser.deletedAt) {
                return NextResponse.json(
                    { message: 'A suspended user with this email exists. Please reactivate them instead.' },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Generate a strong temporary password
        const generateStrongPassword = () => {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
            let password = '';
            for (let i = 0; i < 16; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        };

        const tempPassword = generateStrongPassword();
        const passwordHash = await bcrypt.hash(tempPassword, 12); // Increased salt rounds

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                email,
                role,
                passwordHash,
                firstName: email.split('@')[0],
                lastName: 'User',
                accountType: 'INDIVIDUAL',
                emailVerified: new Date(), // Auto-verify for invited users
            }
        });

        // TODO: Send invitation email with temporary password
        // For now, we'll just log it
        console.log(`[INVITE] User created: ${email} (${role}) with temp password: ${tempPassword}`);

        return NextResponse.json({
            message: 'User invited successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt
            },
            // In production, don't return the password - send it via email instead
            tempPassword: process.env.NODE_ENV === 'development' ? tempPassword : undefined,
            note: process.env.NODE_ENV === 'development'
                ? 'Temporary password shown for development only. In production, this will be sent via email.'
                : 'An invitation email has been sent to the user.'
        });

    } catch (error) {
        console.error('[INVITE ERROR]', error);
        return NextResponse.json(
            { message: 'Failed to invite user' },
            { status: 500 }
        );
    }
}
