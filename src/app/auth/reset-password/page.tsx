"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Globe, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    useEffect(() => {
        if (!token || !email) {
            toast.error("Invalid reset link");
        }
    }, [token, email]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Something went wrong");
            }

            setIsSuccess(true);
            toast.success("Password reset successfully!");

            setTimeout(() => {
                router.push("/auth/signin");
            }, 3000);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Reset failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-red-600">Invalid Link</CardTitle>
                    <CardDescription>
                        This password reset link is invalid or has expired. Please request a new one.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" asChild>
                        <Link href="/auth/forgot-password">Request New Link</Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-xl border-slate-200">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>
                    Enter your new password below to secure your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-emerald-600">Success!</p>
                            <p className="text-sm text-slate-500">Your password has been reset. Redirecting to sign in...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="pl-10"
                                />
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="pl-10"
                                />
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            </div>
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating Password...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                )}
            </CardContent>
            {!isSuccess && (
                <CardFooter>
                    <Link
                        href="/auth/signin"
                        className="text-sm text-slate-500 hover:text-primary transition-colors mx-auto"
                    >
                        Back to sign in
                    </Link>
                </CardFooter>
            )}
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
                <div className="p-1.5 bg-primary rounded-lg transition-transform group-hover:scale-110">
                    <Globe className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">NexaLine</span>
            </Link>

            <Suspense fallback={
                <Card className="w-full max-w-md p-8 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </Card>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
