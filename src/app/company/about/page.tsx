import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Heart, Globe, Zap, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        We are <span className="text-primary">NexaLine</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Our mission is to democratize global communication infrastructure for individuals, solopreneurs, businesses, and developers of all sizes.
                    </p>
                </section>

                <section className="container mx-auto px-4 mb-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team collaborating" className="rounded-2xl shadow-2xl" />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Building the Future of Telecom</h2>
                            <p className="text-lg text-muted-foreground">
                                NexaLine was founded on the belief that meaningful connections should be effortless. In a world that is more connected than ever, the underlying infrastructure remains complex and fragmented.
                            </p>
                            <p className="text-lg text-muted-foreground">
                                We are stripping away the complexity of traditional telephony, replacing it with elegant APIs and intuitive interfaces that empower anyone to build powerful communication experiences.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="p-4 border rounded-lg">
                                    <div className="text-3xl font-bold text-primary mb-1">150+</div>
                                    <div className="text-sm text-muted-foreground">Countries Covered</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-3xl font-bold text-primary mb-1">99.9%</div>
                                    <div className="text-sm text-muted-foreground">Uptime SLA</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-3xl font-bold text-primary mb-1">10k+</div>
                                    <div className="text-sm text-muted-foreground">Developers</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                                    <div className="text-sm text-muted-foreground">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
}
