"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Globe, MessageSquare, Zap, Shield, Clock } from "lucide-react";
import { NetworkBackground } from "@/components/landing/network-background";
import { FloatingIcons } from "@/components/landing/floating-icons";

export function LandingHero() {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 pt-20 pb-12 md:pb-16">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
            </div>

            {/* Floating Discount Badges */}
            <div className="absolute top-[15%] right-[10%] animate-float hidden lg:block">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full shadow-2xl transform rotate-12 font-bold text-sm">
                    <div className="text-xs">Limited Offer</div>
                    <div className="text-2xl">35% OFF</div>
                </div>
            </div>
            <div className="absolute top-[35%] right-[8%] animate-float-delayed hidden lg:block" style={{ animationDelay: '0.5s' }}>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-full shadow-2xl transform -rotate-6 font-bold text-sm">
                    <div className="text-xs">First Month</div>
                    <div className="text-xl">FREE Trial</div>
                </div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-white space-y-5 lg:space-y-6">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span className="text-sm font-medium">Trusted by 10,000+ users worldwide</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold leading-tight">
                            One Platform for
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-white">
                                Global Connectivity
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-xl">
                            Virtual numbers, instant SMS verification, and travel eSIMs—all in one place.
                            Stay connected anywhere, anytime.
                        </p>

                        {/* Discount Highlight */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 lg:p-6 inline-block">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl lg:text-5xl font-black text-yellow-300">35%</span>
                                <div>
                                    <div className="text-xl lg:text-2xl font-bold">discount</div>
                                    <div className="text-xs lg:text-sm text-white/80">Limited time offer</div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4 pt-2">
                            <Button size="lg" className="h-12 lg:h-14 px-6 lg:px-8 text-base lg:text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-2xl font-semibold w-full sm:w-auto" asChild>
                                <Link href="/auth/register">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 lg:h-5 w-4 lg:w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 lg:h-14 px-6 lg:px-8 text-base lg:text-lg border-2 border-white bg-white/95 text-blue-600 hover:bg-white backdrop-blur-sm font-semibold w-full sm:w-auto shadow-lg" asChild>
                                <Link href="/pricing">
                                    View Pricing
                                </Link>
                            </Button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-2">
                            <div className="flex items-center gap-2 text-white/90">
                                <Shield className="h-4 lg:h-5 w-4 lg:w-5" />
                                <span className="text-xs lg:text-sm font-medium">Secure & Private</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <Globe className="h-4 lg:h-5 w-4 lg:w-5" />
                                <span className="text-xs lg:text-sm font-medium">150+ Countries</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <Clock className="h-4 lg:h-5 w-4 lg:w-5" />
                                <span className="text-xs lg:text-sm font-medium">24/7 Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual - Service Cards */}
                    <div className="relative mt-8 lg:mt-0">
                        <div className="space-y-4">
                            {/* Virtual Numbers Card */}
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
                                <div className="flex items-start gap-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
                                        <Phone className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Virtual Numbers</h3>
                                        <p className="text-sm text-gray-600">Local, toll-free & mobile numbers from 150+ countries</p>
                                        <div className="mt-3 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            <Zap className="h-3 w-3" />
                                            Starting at $5/month
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SMS OTP Card */}
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform lg:ml-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                                        <MessageSquare className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Instant SMS OTP</h3>
                                        <p className="text-sm text-gray-600">Secure verification codes delivered instantly</p>
                                        <div className="mt-3 inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            <Zap className="h-3 w-3" />
                                            From $10/100 codes
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Travel eSIM Card */}
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
                                <div className="flex items-start gap-4">
                                    <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-3 rounded-xl">
                                        <Globe className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Travel eSIM</h3>
                                        <p className="text-sm text-gray-600">Stay connected globally with digital SIM cards</p>
                                        <div className="mt-3 inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            <Zap className="h-3 w-3" />
                                            Europe from $8/1GB
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge on Cards */}
                        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-xl transform rotate-12 font-bold text-sm animate-pulse">
                            🎉 Special Launch Offer
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(12deg); }
                    50% { transform: translateY(-15px) rotate(12deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(-6deg); }
                    50% { transform: translateY(-20px) rotate(-6deg); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 5s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
