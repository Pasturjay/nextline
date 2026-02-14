import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-cyan-500/30">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="relative py-20 overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 opacity-10" />
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent_50%)]" />
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
                            Contact Us
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">Touch</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Have questions about our API, pricing, or enterprise solutions? Our team is ready to help.
                        </p>
                    </div>
                </section>

                <section className="container mx-auto px-4 mb-20">
                    <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
                            <div className="flex items-start gap-4">
                                <Mail className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Email</h3>
                                    <p className="text-muted-foreground">support@nexaline.com</p>
                                    <p className="text-muted-foreground">sales@nexaline.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Phone</h3>
                                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                    <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm EST</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="h-6 w-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Office</h3>
                                    <p className="text-muted-foreground">[Your Company Address]</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card p-8 rounded-xl border shadow-lg">
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First name</Label>
                                        <Input id="first-name" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last name</Label>
                                        <Input id="last-name" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" placeholder="john@example.com" type="email" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                                </div>
                                <Button className="w-full">Send Message</Button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
}
