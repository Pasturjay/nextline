import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Check, Plane, Wifi, Smartphone } from "lucide-react";
import Link from "next/link";

export default function TravelEsimPage() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Stay Connected <span className="text-green-600">Anywhere</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Travel smart with local numbers and data. No physical SIM card required, instant activation on arrival.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/dashboard/travel">
                            <Button size="lg" className="rounded-full px-8 bg-green-600 hover:bg-green-700 text-white">Find Your Destination</Button>
                        </Link>
                    </div>
                </section>

                <section className="container mx-auto px-4 mb-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
                                <Plane className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No Roaming Fees</h3>
                            <p className="text-muted-foreground">Pay local rates for calls and data. Save up to 80% compared to traditional carrier roaming.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
                                <Wifi className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Instant Connectivity</h3>
                            <p className="text-muted-foreground">Activate your number and data plan the moment you land. No hunting for SIM kiosks.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
                                <Smartphone className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Keep Your Main Number</h3>
                            <p className="text-muted-foreground">Your primary number stays active for urgent calls while you use NexaLine for local data and calls.</p>
                        </div>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
}
