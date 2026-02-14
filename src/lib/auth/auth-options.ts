import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        AzureADProvider({
            clientId: process.env.MICROSOFT_CLIENT_ID || "",
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
            tenantId: process.env.MICROSOFT_TENANT_ID,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("[Auth] Authorize called with:", { email: credentials?.email });

                if (!credentials?.email || !credentials?.password) {
                    console.log("[Auth] Missing credentials");
                    throw new Error("Email and password are required");
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(credentials.email)) {
                    console.log("[Auth] Invalid email format");
                    throw new Error("Invalid email format");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user) {
                    console.log("[Auth] User not found:", credentials.email);
                    throw new Error("Invalid email or password");
                }

                // Check if user is suspended (soft deleted)
                if (user.deletedAt) {
                    console.log("[Auth] User is suspended:", user.email);
                    throw new Error("This account has been suspended. Please contact support.");
                }

                if (!user.passwordHash) {
                    console.log("[Auth] User has no password hash:", user.id);
                    throw new Error("Please use social login or reset your password");
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

                console.log("[Auth] Password validation result:", isValid);

                if (!isValid) {
                    console.log("[Auth] Invalid password for user:", user.email);
                    throw new Error("Invalid email or password");
                }

                console.log("[Auth] Login successful for user:", user.email, "Role:", user.role);

                return {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    role: user.role,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                // session.user.id = token.id as string; // Typescript might complain, handled in types/next-auth.d.ts
                session.user = {
                    ...session.user,
                    // @ts-ignore
                    id: token.id,
                    // @ts-ignore
                    role: token.role
                }
            }
            return session;
        }
    }
};
