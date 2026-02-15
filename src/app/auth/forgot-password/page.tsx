"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Globe, ArrowLeft, Mail, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Something went wrong");
            }

            setIsSubmitted(true);
            toast.success("Reset link sent if account exists");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Request failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
                <div className="p-1.5 bg-primary rounded-lg transition-transform group-hover:scale-110">
                    <Globe className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">NexaLine</span>
            </Link>

            <Card className="w-full max-w-md shadow-xl border-slate-200">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-center">Forgot Password?</CardTitle>
                    <CardDescription className="text-center">
                        {isSubmitted
                            ? "Check your email for a link to reset your password."
                            : "Enter your email address and we'll send you a link to reset your password."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isSubmitted ? (
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="pl-10"
                                    />
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                </div>
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Mail className="h-8 w-8 text-emerald-600" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-emerald-600">Verification Link Sent</p>
                                <p className="text-sm text-slate-500">We've sent an email to {email}</p>
                            </div>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Try another email
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Link
                        href="/auth/signin"
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mx-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
