"use client";

import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageSquare, Globe, Smartphone, CreditCard, ShieldCheck } from "lucide-react";

export default function FAQPage() {
    const faqCategories = [
        {
            id: "general",
            label: "General",
            icon: HelpCircle,
            questions: [
                {
                    q: "What is NexaLine?",
                    a: "NexaLine is a comprehensive communication platform that provides virtual phone numbers, travel eSIMs for global data, and instant SMS verification services. We help individuals and businesses stay connected without the need for physical SIM cards or expensive roaming fees."
                },
                {
                    q: "Who is NexaLine for?",
                    a: "We serve a wide range of users: travelers needing data abroad, businesses requiring local presence in multiple countries, developers needing SMS APIs, and privacy-conscious users who want a secondary number for online services."
                },
                {
                    q: "Do I need to be a technical expert to use this?",
                    a: "Not at all! Our platform is designed to be user-friendly. You can buy a number, activate an eSIM, or send an SMS with just a few clicks from our dashboard."
                }
            ]
        },
        {
            id: "numbers",
            label: "Virtual Numbers",
            icon: Smartphone,
            questions: [
                {
                    q: "What is a Virtual Number?",
                    a: "A virtual number allows you to make and receive calls/texts via the internet without a physical SIM card. It works just like a regular phone number but lives in our app or on your dashboard."
                },
                {
                    q: "Can I use these numbers for WhatsApp/Telegram verification?",
                    a: "Yes, our mobile virtual numbers are compatible with most major platforms including WhatsApp, Telegram, Uber, and more. However, service availability may vary by country regulations."
                },
                {
                    q: "Do I need a new phone for this?",
                    a: "No. You can use your existing smartphone, tablet, or computer. Our service works through your internet connection (Wi-Fi or mobile data)."
                },
                {
                    q: "Can I keep my number if I switch devices?",
                    a: "Absolutely. Your number is linked to your NexaLine account, not your device. Simply log in on your new device and your number is there. You never lose it as long as your subscription is active."
                }
            ]
        },
        {
            id: "esim",
            label: "Travel eSIM",
            icon: Globe,
            questions: [
                {
                    q: "What is an eSIM?",
                    a: "An eSIM (embedded SIM) is a digital SIM that allows you to activate a cellular plan from a carrier without having to use a physical nano-SIM. It's built into most modern smartphones."
                },
                {
                    q: "How do I install the Travel eSIM?",
                    a: "After purchase, you'll receive a QR code via email and in your dashboard. Go to your phone settings, select 'Add eSIM' or 'Add Cellular Plan', and scan the code. It takes less than 2 minutes."
                },
                {
                    q: "Will my regular number still work?",
                    a: "Yes! Modern phones allow you to keep your primary SIM active for calls/texts while using the NexaLine eSIM for data. This means you avoid expensive roaming charges but remain reachable."
                },
                {
                    q: "Which devices are compatible?",
                    a: "Most smartphones released since 2018 support eSIM. This includes iPhone XR and newer, Samsung Galaxy S20 and newer, and Google Pixel 3 and newer. Please check your specific device specifications."
                }
            ]
        },
        {
            id: "otp",
            label: "SMS & OTP",
            icon: MessageSquare,
            questions: [
                {
                    q: "How fast is SMS delivery?",
                    a: "Our SMS delivery is near-instant, typically arriving within 2-5 seconds depending on the carrier network conditions."
                },
                {
                    q: "What countries do you support?",
                    a: "We support sending SMS to over 150 countries globally. Our network automatically routes messages through the fastest and most reliable local carriers."
                },
                {
                    q: "Do you offer an API for developers?",
                    a: "Yes, we offer a robust API for sending SMS and managing numbers programmatically. You can find comprehensive documentation and code examples in our Developer Portal."
                }
            ]
        },
        {
            id: "billing",
            label: "Billing & Payments",
            icon: CreditCard,
            questions: [
                {
                    q: "What payment methods do you accept?",
                    a: "We accept major credit/debit cards (Visa, Mastercard, Amex) via Stripe and PayPal. All transactions are securely processed."
                },
                {
                    q: "Are there any hidden fees?",
                    a: "No. We believe in transparent pricing. The price you see for a subscription or eSIM plan is what you pay. There are no activation fees or hidden service charges."
                },
                {
                    q: "Can I cancel my subscription?",
                    a: "Yes, you can cancel your monthly subscription for virtual numbers at any time from your dashboard. Most eSIM plans are one-time prepaid purchases and do not renew automatically."
                },
                {
                    q: "Do you offer refunds?",
                    a: "We assume responsibility for our service quality. If an eSIM fails to activate due to a technical error on our side, we offer a full refund. Please contact support for assistance."
                }
            ]
        },
        {
            id: "security",
            label: "Security & Privacy",
            icon: ShieldCheck,
            questions: [
                {
                    q: "Is my personal data safe?",
                    a: "Security is our top priority. We use industry-standard encryption for all data transmission and storage. We do not sell your personal data to third parties."
                },
                {
                    q: "Are my calls and messages private?",
                    a: "Yes. We adhere to strict privacy standards. Your communication logs are accessible only to you through your secure dashboard account."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Frequently Asked <span className="text-primary">Questions</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to know about NexaLine's services, billing, and technical details.
                        </p>
                    </div>

                    <Tabs defaultValue="general" className="w-full">
                        <div className="flex justify-center mb-10 overflow-x-auto pb-4 md:pb-0">
                            <TabsList className="h-auto p-1 flex-wrap justify-center gap-2 bg-transparent">
                                {faqCategories.map((category) => (
                                    <TabsTrigger
                                        key={category.id}
                                        value={category.id}
                                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-full border border-muted hover:bg-muted/50 transition-colors"
                                    >
                                        <category.icon className="w-4 h-4 mr-2" />
                                        {category.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {faqCategories.map((category) => (
                            <TabsContent key={category.id} value={category.id} className="mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <category.icon className="w-6 h-6 text-primary" />
                                            {category.label} Questions
                                        </CardTitle>
                                        <CardDescription>
                                            Common inquiries about {category.label.toLowerCase()}.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Accordion type="single" collapsible className="w-full">
                                            {category.questions.map((faq, index) => (
                                                <AccordionItem key={index} value={`${category.id}-${index}`}>
                                                    <AccordionTrigger className="text-base md:text-lg font-medium text-left">
                                                        {faq.q}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                                        {faq.a}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>

                    <div className="mt-16 text-center">
                        <p className="text-muted-foreground mb-4">
                            Can't find what you're looking for?
                        </p>
                        <a href="/company/contact" className="text-primary font-semibold hover:underline">
                            Contact our Support Team &rarr;
                        </a>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
