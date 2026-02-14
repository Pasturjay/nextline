import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Smartphone, ShieldCheck, MessageSquare, Briefcase, Plane, Lock, Users } from "lucide-react";
import Link from "next/link";

export default function UseCasesPage() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="container mx-auto px-4 mb-24 text-center">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
                        <Briefcase className="mr-2 h-4 w-4" /> Solutions for every need
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Everyone</span>, Everywhere
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                        Whether you're expanding your business globally, traveling the world, verifying users, or staying connected, NexaLine provides the communication tools you need.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/auth/register">
                            <Button size="lg" className="rounded-full px-8">Get Started Free</Button>
                        </Link>
                        <Link href="#explore">
                            <Button size="lg" variant="outline" className="rounded-full px-8">Explore Use Cases</Button>
                        </Link>
                    </div>
                </section>

                {/* Use Case 1: Global Business */}
                <section id="explore" className="container mx-auto px-4 mb-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full -z-10" />
                            <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
                                <Globe className="h-12 w-12 text-blue-500 mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Local Presence, Global Reach</h3>
                                <p className="text-muted-foreground mb-6">
                                    Establish a local presence in 150+ countries without opening a physical office. Get local phone numbers that your customers recognize and trust.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        <span>Instant activation of local/toll-free numbers</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        <span>Forward calls to any device worldwide</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        <span>Professional voicemail and custom greetings</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 px-4">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Expand Your Business</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Don't let geography limit your growth. With NexaLine, you can look like a local business in London, New York, Tokyo, and Sydney—all from your laptop.
                            </p>
                            <Link href="/dashboard/buy-number">
                                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                    Search Global Numbers <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Use Case 2: Travel Connectivity */}
                <section className="bg-slate-50 dark:bg-slate-900 py-24 mb-32">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="px-4">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Travel Connected</h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    Avoid expensive roaming charges. Rent a temporary local number for your destination to make reservations, use ride-sharing apps, and stay in touch locally.
                                </p>
                                <Link href="/dashboard/travel">
                                    <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                        Find Travel Numbers <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/10 blur-[80px] rounded-full -z-10" />
                                <div className="bg-background border border-border/50 rounded-2xl p-8 shadow-2xl">
                                    <Plane className="h-12 w-12 text-green-500 mb-6" />
                                    <h3 className="text-2xl font-bold mb-4">Seamless Roaming</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Perfect for digital nomads and vacationers. Get a number for 7, 30, or 90 days and let it expire automatically when you leave.
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <span>Short-term rentals (7-90 days)</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <span>Receive verification codes abroad</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            <span>No SIM card swapping required</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Case 3: Secure Verification */}
                <section className="container mx-auto px-4 mb-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute inset-0 bg-purple-500/10 blur-[80px] rounded-full -z-10" />
                            <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
                                <ShieldCheck className="h-12 w-12 text-purple-500 mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Identity Verification</h3>
                                <p className="text-muted-foreground mb-6">
                                    Keep your accounts secure with instant verification codes. Perfect for account sign-ups, password resets, and two-factor authentication.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                                        <span>Instant verification code delivery</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                                        <span>High reliability with backup routes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                                        <span>Real-time delivery confirmation</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 px-4">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Secure</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Add an extra layer of security to your accounts and services. Get instant verification codes for sign-ups, logins, and sensitive actions.
                            </p>
                            <Link href="/dashboard/otp">
                                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                                    Try Instant OTP <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Use Case 4: Customer Engagement */}
                <section className="bg-slate-50 dark:bg-slate-900 py-24 mb-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="px-4">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Engage Customers</h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    Send appointment reminders, order notifications, and promotional offers directly to your customers' pockets.
                                </p>
                                <Link href="/dashboard/messages">
                                    <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                                        Start Messaging <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full -z-10" />
                                <div className="bg-background border border-border/50 rounded-2xl p-8 shadow-2xl">
                                    <MessageSquare className="h-12 w-12 text-orange-500 mb-6" />
                                    <h3 className="text-2xl font-bold mb-4">Two-Way Communication</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Have real conversations with your customers. Send updates, receive responses, and manage everything from your dashboard.
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                                            <span>Bulk SMS campaigns</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                                            <span>Two-way messaging enabled numbers</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                                            <span>Rich media support (MMS) coming soon</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 text-center py-12">
                    <h2 className="text-3xl font-bold mb-6">Ready to see it in action?</h2>
                    <Link href="/auth/register">
                        <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20">
                            Create Your Free Account
                        </Button>
                    </Link>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}
