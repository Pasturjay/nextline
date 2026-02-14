import {
    Globe,
    Smartphone,
    ShieldCheck,
    BarChart3,
    Zap,
    MessageSquare,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
    {
        title: "Virtual Phone Numbers",
        description: "Get local, mobile, and toll-free numbers in 150+ countries. Instant setup with call forwarding, voicemail, and SMS capabilities.",
        icon: Globe,
        color: "text-blue-500",
        href: "/dashboard/numbers"
    },
    {
        title: "Travel eSIM",
        description: "Stay connected worldwide with instant mobile data. Activate eSIM plans for 150+ countries directly from your phone.",
        icon: Smartphone,
        color: "text-emerald-500",
        href: "/dashboard/travel"
    },
    {
        title: "Instant SMS OTP",
        description: "Receive verification codes instantly for any service. Perfect for privacy and bypassing regional restrictions.",
        icon: MessageSquare,
        color: "text-purple-500",
        href: "/dashboard/sms"
    },
    {
        title: "Enterprise Security",
        description: "Bank-grade encryption, secure payments, and privacy-first architecture to protect your communications.",
        icon: ShieldCheck,
        color: "text-rose-500",
        href: "/security"
    },
    {
        title: "Real-time Analytics",
        description: "Track usage, spending, and connectivity stats in real-time with our advanced dashboard.",
        icon: BarChart3,
        color: "text-amber-500",
        href: "/dashboard"
    },
    {
        title: "API Integration",
        description: "Build custom communication solutions with our robust, developer-friendly API.",
        icon: Zap,
        color: "text-cyan-500",
        href: "/docs"
    }
];

export function LandingFeatures() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
            {/* Subtle Gradient Accent from Hero */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                        Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">stay connected</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        A complete suite of telecommunication tools designed for modern travelers, businesses, and developers.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700 overflow-hidden">
                            {/* Hover Gradient Border Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600 group-hover:w-full transition-all duration-500" />

                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-slate-50 dark:bg-slate-900 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={`h-7 w-7 ${feature.color}`} />
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                {feature.description}
                            </p>

                            <Link href={feature.href} className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                Learn more <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
