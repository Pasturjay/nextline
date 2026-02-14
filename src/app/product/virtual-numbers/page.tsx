import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Check, Globe, Phone, Shield } from "lucide-react";
import Link from "next/link";

export default function VirtualNumbersPage() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Virtual Numbers for <span className="text-primary">Global Business</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Instantly activate local phone numbers in 150+ countries. Manage calls and SMS from a single dashboard.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/dashboard/buy-number">
                            <Button size="lg" className="rounded-full px-8">Get Started</Button>
                        </Link>
                        <Link href="#pricing">
                            <Button size="lg" variant="outline" className="rounded-full px-8">View Pricing</Button>
                        </Link>
                    </div>
                </section>

                {/* Features */}
                <section className="container mx-auto px-4 mb-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 border rounded-xl bg-card">
                            <Globe className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
                            <p className="text-muted-foreground">Access numbers in 150+ countries including US, UK, Canada, Australia, and more.</p>
                        </div>
                        <div className="p-6 border rounded-xl bg-card">
                            <Phone className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Voice & SMS</h3>
                            <p className="text-muted-foreground">Full capabilities for both voice calls and SMS messaging on supported numbers.</p>
                        </div>
                        <div className="p-6 border rounded-xl bg-card">
                            <Shield className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Enterprise Grade</h3>
                            <p className="text-muted-foreground">Crystal clear voice quality and high deliverability designed for business use.</p>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" className="container mx-auto px-4 mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="p-8 border rounded-xl bg-card">
                            <h3 className="text-xl font-bold mb-2">Standard</h3>
                            <div className="text-3xl font-bold mb-4">$5<span className="text-sm font-normal text-muted-foreground">/mo per number</span></div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> US/Canada Numbers</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Inbound SMS</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Call Forwarding</li>
                            </ul>
                            <Link href="/dashboard/buy-number">
                                <Button className="w-full">Choose Standard</Button>
                            </Link>

                        </div>
                        <div className="p-8 border rounded-xl bg-primary/5 border-primary">
                            <h3 className="text-xl font-bold mb-2">Global</h3>
                            <div className="text-3xl font-bold mb-4">$15<span className="text-sm font-normal text-muted-foreground">/mo per number</span></div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> International Numbers</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 2-Way SMS</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Voicemail & Recording</li>
                            </ul>
                            <Link href="/dashboard/buy-number">
                                <Button className="w-full">Choose Global</Button>
                            </Link>
                        </div>
                        <div className="p-8 border rounded-xl bg-card">
                            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                            <div className="text-3xl font-bold mb-4">Custom</div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Volume Discounts</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Dedicated Support</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Custom Integrations</li>
                            </ul>
                            <Link href="/company/contact">
                                <Button variant="outline" className="w-full">Contact Sales</Button>
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <LandingFooter />
        </div>
    );
}
