import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function LandingCTA() {
    return (
        <section className="py-20 md:py-24 relative overflow-hidden bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
            </div>

            {/* Floating Accent */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-4 relative z-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6">
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm font-medium text-white">Limited Time Offer</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                    Ready to scale your communication?
                </h2>
                <p className="text-lg md:text-xl text-white/95 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                    Experience the future of borderless communication. Connect globally with virtual numbers, instant OTPs, and travel eSIMs—all in one seamless platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="h-12 lg:h-14 px-8 text-base lg:text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 shadow-2xl rounded-full hover:scale-105 transition-transform" asChild>
                        <Link href="/auth/register">
                            Create Free Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" className="h-12 lg:h-14 px-8 text-base lg:text-lg font-semibold bg-white/95 text-blue-600 border-2 border-white hover:bg-white hover:scale-105 transition-all rounded-full shadow-lg" asChild>
                        <Link href="/contact">
                            Contact Sales
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
