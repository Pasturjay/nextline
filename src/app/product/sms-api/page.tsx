import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Check, Shield, Zap, Globe, Lock, MessageSquare, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SmsApiPage() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="container mx-auto px-4 text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Verify Users Instantly with <span className="text-purple-600">SMS OTP</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Secure two-factor authentication and account verification for your business.
                        No coding required—just simple, reliable SMS verification in 150+ countries.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/auth/register">
                            <Button size="lg" className="rounded-full px-8 bg-purple-600 hover:bg-purple-700 text-white">
                                Start Verifying Users
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button size="lg" variant="outline" className="rounded-full px-8">
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="container mx-auto px-4 mb-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-muted">
                            <CardHeader>
                                <Zap className="h-10 w-10 text-purple-600 mb-4" />
                                <CardTitle>Instant Delivery</CardTitle>
                                <CardDescription>
                                    OTP codes delivered in seconds to any mobile number worldwide
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-muted">
                            <CardHeader>
                                <Globe className="h-10 w-10 text-blue-600 mb-4" />
                                <CardTitle>Global Coverage</CardTitle>
                                <CardDescription>
                                    Reach users in 150+ countries with 99.9% delivery success rate
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-muted">
                            <CardHeader>
                                <Shield className="h-10 w-10 text-green-600 mb-4" />
                                <CardTitle>Secure & Reliable</CardTitle>
                                <CardDescription>
                                    Enterprise-grade security with automatic retry and fallback
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section className="container mx-auto px-4 mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect for Every Business</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            From startups to enterprises, secure your platform with SMS verification
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="flex gap-4 p-6 bg-secondary/20 rounded-xl">
                            <Users className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-2">Account Sign-Ups</h3>
                                <p className="text-sm text-muted-foreground">
                                    Verify new users during registration to prevent fake accounts and spam
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-secondary/20 rounded-xl">
                            <Lock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
                                <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security to protect user accounts from unauthorized access
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-secondary/20 rounded-xl">
                            <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-2">Password Resets</h3>
                                <p className="text-sm text-muted-foreground">
                                    Securely verify identity before allowing password changes
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-secondary/20 rounded-xl">
                            <MessageSquare className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-2">Transaction Confirmations</h3>
                                <p className="text-sm text-muted-foreground">
                                    Confirm sensitive actions like payments and withdrawals
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 mb-20 bg-slate-950 text-slate-50 py-16 rounded-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Simple, secure verification in three easy steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="font-semibold text-lg mb-2">User Enters Phone</h3>
                            <p className="text-sm text-slate-400">
                                Your user provides their mobile number during sign-up or login
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Instant OTP Sent</h3>
                            <p className="text-sm text-slate-400">
                                We send a unique verification code via SMS in seconds
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Account Verified</h3>
                            <p className="text-sm text-slate-400">
                                User enters code to confirm identity and complete verification
                            </p>
                        </div>
                    </div>
                </section>

                {/* Simple Dashboard Preview */}
                <section className="container mx-auto px-4 mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Easy to Use Dashboard</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Manage all your SMS verifications from one simple interface. No technical knowledge required.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-secondary/20 rounded-xl p-8">
                        <ul className="grid md:grid-cols-2 gap-4">
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>Send OTPs with one click</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>Track delivery status in real-time</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>View usage analytics and reports</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>Manage multiple projects</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>Customize sender ID</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>24/7 customer support</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Developer Note */}
                <section className="container mx-auto px-4 mb-20">
                    <Card className="max-w-3xl mx-auto border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                For Developers
                            </CardTitle>
                            <CardDescription className="text-foreground/80">
                                Need programmatic access? We also offer a powerful REST API with comprehensive documentation,
                                SDKs in multiple languages, and webhook support.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/docs/sms">
                                <Button variant="outline">View API Documentation</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-3xl p-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Start Securing Your Platform Today
                        </h2>
                        <p className="text-lg mb-8 opacity-90">
                            Join thousands of businesses using NexaLine for reliable SMS verification
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/auth/register">
                                <Button size="lg" variant="secondary" className="rounded-full px-8">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="/company/contact">
                                <Button size="lg" variant="outline" className="rounded-full px-8 border-white text-white hover:bg-white/10">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
}
