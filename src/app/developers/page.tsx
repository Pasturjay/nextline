import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Terminal, Book, Zap, Shield, Globe, Cpu, Network } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function DevelopersPage() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 relative overflow-hidden">
            <LandingNavbar />

            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
            </div>

            <main className="pt-24 pb-16">
                {/* Hero */}
                <section className="container mx-auto px-4 text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6 shadow-sm">
                        <Code className="mr-2 h-3 w-3 text-primary" />
                        Developer Hub
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Build global communication <br />
                        <span className="text-primary">into your applications</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        The programmable communication platform for everyone — whether you're building apps, managing business communications, or verifying users.
                        Send SMS, provision numbers, and manage verification flows with a few lines of code.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/docs">
                            <Button size="lg" className="rounded-full px-8 h-12 gap-2 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                <Book className="h-4 w-4" />
                                Read the Docs
                            </Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 gap-2 text-base hover:bg-secondary/80 transition-all">
                                Get API Keys
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* API Features */}
                <section className="container mx-auto px-4 mb-24">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Terminal className="h-6 w-6 text-primary" />}
                            title="REST API"
                            description="Simple, predictable resource-oriented URLs following standard HTTP practices."
                            link="/docs/api"
                            linkText="View Reference"
                            delay="delay-100"
                        />
                        <FeatureCard
                            icon={<Zap className="h-6 w-6 text-primary" />}
                            title="Webhooks"
                            description="Real-time events for incoming messages, delivery reports, and status updates."
                            link="/docs/webhooks"
                            linkText="Webhooks Guide"
                            delay="delay-200"
                        />
                        <FeatureCard
                            icon={<Shield className="h-6 w-6 text-primary" />}
                            title="Secure & Compliant"
                            description="Enterprise-grade security with API keys, IP whitelisting, and TLS 1.2+ encryption."
                            link="/docs/security"
                            linkText="Security Best Practices"
                            delay="delay-300"
                        />
                    </div>
                </section>

                {/* Code Example */}
                <section className="container mx-auto px-4 mb-24 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                    <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Cpu className="h-64 w-64 text-primary" />
                        </div>
                        <div className="grid md:grid-cols-2 relative z-10">
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-medium text-green-400">Live API</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Integate in seconds</h3>
                                <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                                    Sending a message is as simple as a single HTTP request. We provide SDKs for Node.js, Python, Go, and more to get you started immediately.
                                </p>
                                <div className="flex gap-4">
                                    <TechBadge label="Node" icon="JS" />
                                    <TechBadge label="Python" icon="PY" />
                                    <TechBadge label="Go" icon="GO" />
                                </div>
                            </div>
                            <div className="bg-slate-900/50 p-8 md:p-12 border-l border-slate-800 overflow-x-auto backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono ml-2">sms-example.js</div>
                                </div>
                                <pre className="font-mono text-sm leading-relaxed">
                                    <code className="text-slate-300">
                                        {`const client = require('nexaline')('YOUR_KEY');

// Send a message
const message = await client.messages.create({
  to: '+15558675309',
  from: '+15017122661',
  body: 'Your verification code is 123456'
});

console.log(message.sid);`}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Secondary Features */}
                <section className="container mx-auto px-4 mb-20 text-center">
                    <h2 className="text-3xl font-bold mb-12">Everything you need to build</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SmallFeatureCard title="Global Reach" icon={<Globe className="h-5 w-5" />} />
                        <SmallFeatureCard title="99.99% Uptime" icon={<Network className="h-5 w-5" />} />
                        <SmallFeatureCard title=" instant Provisioning" icon={<Zap className="h-5 w-5" />} />
                        <SmallFeatureCard title="24/7 Support" icon={<Shield className="h-5 w-5" />} />
                    </div>
                </section>

            </main>
            <LandingFooter />
        </div>
    );
}

function FeatureCard({ icon, title, description, link, linkText, delay }: any) {
    return (
        <Card className={cn("bg-background/60 backdrop-blur-sm border-muted hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-8 fill-mode-both", delay)}>
            <CardHeader>
                <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 w-fit">
                    {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="text-base mt-2">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href={link} className="text-sm font-medium text-primary hover:underline flex items-center group">
                    {linkText} <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
            </CardContent>
        </Card>
    );
}

function TechBadge({ label, icon }: any) {
    return (
        <div className="flex flex-col gap-2 items-center group cursor-default">
            <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 font-mono text-xs text-slate-500 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                {icon}
            </div>
            <div className="text-xs text-slate-500">{label}</div>
        </div>
    )
}

function SmallFeatureCard({ title, icon }: any) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
            <div className="text-primary">{icon}</div>
            <div className="font-medium">{title}</div>
        </div>
    )
}
