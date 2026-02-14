import { Shield, Globe, TrendingUp, Users } from "lucide-react";
import { MetricCounter } from "./metric-counter";

export function LandingStats() {
    const stats = [
        { value: 80, suffix: "+", label: "Countries Covered", decimals: 0 },
        { value: 99.99, suffix: "%", label: "API Uptime", decimals: 2 },
        { value: 50, suffix: "M+", label: "Messages Sent", decimals: 0 },
        { value: 10, suffix: "K+", label: "Active Developers", decimals: 0 },
    ];

    const compliance = [
        { icon: Shield, label: "SOC 2 Certified" },
        { icon: Shield, label: "GDPR Compliant" },
        { icon: Shield, label: "HIPAA Ready" },
    ];

    return (
        <section className="py-16 md:py-24 relative">
            <div className="container mx-auto px-4 relative z-10">
                {/* Main Stats */}
                <div className="rounded-xl border bg-card p-8 md:p-12 mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                        Trusted by developers worldwide
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg border bg-background/50"
                            >
                                <MetricCounter
                                    end={stat.value}
                                    suffix={stat.suffix}
                                    label={stat.label}
                                    decimals={stat.decimals}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compliance & Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-4 items-center mb-8">
                    <div className="flex items-center gap-2 border rounded-full px-6 py-3 bg-card">
                        <Globe className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Global Infrastructure</span>
                    </div>

                    {compliance.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 border rounded-full px-6 py-3 bg-card"
                        >
                            <item.icon className="w-5 h-5 text-success-green" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </div>
                    ))}

                    <div className="flex items-center gap-2 border rounded-full px-6 py-3 bg-card">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">99.99% SLA</span>
                    </div>
                </div>

                {/* Enterprise Ready Badge */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 border rounded-full px-8 py-4 bg-card">
                        <Users className="w-6 h-6 text-primary" />
                        <span className="text-lg font-semibold">
                            Enterprise-Grade Communications Platform
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
