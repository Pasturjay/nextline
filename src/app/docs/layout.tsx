import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 flex flex-col">
            <LandingNavbar />

            <div className="container mx-auto px-4 flex-1 flex gap-12 pt-24 pb-16">
                {/* Sidebar */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-24">
                        <div className="mb-6 px-2">
                            <h4 className="font-bold text-lg tracking-tight">Documentation</h4>
                            <p className="text-xs text-muted-foreground mt-1">v1.0.0</p>
                        </div>

                        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
                            <div className="space-y-8 px-2">
                                <DocSection title="Getting Started">
                                    <DocLink href="/docs">Introduction</DocLink>
                                    <DocLink href="/docs/authentication">Authentication</DocLink>
                                    <DocLink href="/docs/quickstart">Quickstart Guide</DocLink>
                                </DocSection>

                                <DocSection title="Products">
                                    <DocLink href="/docs/sms">SMS Messaging</DocLink>
                                    <DocLink href="/docs/numbers">Virtual Numbers</DocLink>
                                    <DocLink href="/docs/otp">OTP Verification</DocLink>
                                    <DocLink href="/docs/sdks">SDKs & Libraries</DocLink>
                                </DocSection>

                                <DocSection title="API Reference">
                                    <DocLink href="/docs/api">Full API Ref</DocLink>
                                    <DocLink href="/docs/webhooks">Webhooks</DocLink>
                                    <DocLink href="/docs/errors">Error Codes</DocLink>
                                </DocSection>
                            </div>
                        </ScrollArea>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>

            <LandingFooter />
        </div>
    );
}

function DocSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div>
            <h5 className="text-sm font-semibold text-foreground/90 mb-3">{title}</h5>
            <ul className="space-y-1.5 border-l border-border/50 pl-4">
                {children}
            </ul>
        </div>
    )
}

function DocLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link
                href={href}
                className="block text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200"
            >
                {children}
            </Link>
        </li>
    )
}
