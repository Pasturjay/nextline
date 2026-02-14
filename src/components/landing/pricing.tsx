import { ArrowRight, Globe, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LandingPricing() {
    return (
        <section id="pricing" className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Simple, transparent pricing.
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Choose the model that fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
                    {/* Virtual Numbers Preview */}
                    <Card className="hover:border-primary/50 transition-colors">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto p-3 bg-blue-500/10 rounded-full w-fit mb-4">
                                <Phone className="h-6 w-6 text-blue-500" />
                            </div>
                            <CardTitle>Virtual Numbers</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="text-3xl font-bold mb-2">$5<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                            <p className="text-sm text-muted-foreground mb-6">
                                Local & mobile numbers in 150+ countries.
                            </p>
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">Starter Plan</span>
                        </CardContent>
                    </Card>

                    {/* Travel eSIM Preview */}
                    <Card className="hover:border-primary/50 transition-colors border-primary/20 shadow-lg shadow-primary/5">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto p-3 bg-green-500/10 rounded-full w-fit mb-4">
                                <Globe className="h-6 w-6 text-green-500" />
                            </div>
                            <CardTitle>Travel eSIM</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="text-3xl font-bold mb-2">$10<span className="text-sm font-normal text-muted-foreground">+</span></div>
                            <p className="text-sm text-muted-foreground mb-6">
                                Regional data plans for 150+ countries.
                            </p>
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">From $2.60/GB</span>
                        </CardContent>
                    </Card>

                    {/* SMS OTP Preview */}
                    <Card className="hover:border-primary/50 transition-colors">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto p-3 bg-purple-500/10 rounded-full w-fit mb-4">
                                <MessageSquare className="h-6 w-6 text-purple-500" />
                            </div>
                            <CardTitle>SMS OTP</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="text-3xl font-bold mb-2">$5<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                            <p className="text-sm text-muted-foreground mb-6">
                                Instant verification. Global delivery.
                            </p>
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">100 OTPs/month</span>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <Button size="lg" asChild className="rounded-full px-8">
                        <Link href="/pricing">
                            View Full Pricing & Plans <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
