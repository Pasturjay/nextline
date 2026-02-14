"use client";

import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Phone, Globe, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/providers/currency-provider";

export default function PricingPage() {
    const { format, isLoading } = useCurrency();
    const [isAnnual, setIsAnnual] = useState(false);

    const pricing = {
        starter: isAnnual ? 4.5 : 5.5,
        professional: isAnnual ? 9.5 : 11.5,
        business: isAnnual ? 21.5 : 26.5,
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <div className="container mx-auto px-4 text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Transparent Pricing for <br className="hidden md:block" />
                        <span className="text-primary">Global Connectivity</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Whether you need a business number, a travel eSIM, or instant SMS verification,
                        we have a simple plan that fits your needs. No hidden fees.
                    </p>
                </div>

                {/* Pricing Tabs */}
                <div className="container mx-auto px-4">
                    <Tabs defaultValue="numbers" className="w-full max-w-5xl mx-auto">
                        <div className="flex justify-center mb-10">
                            <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
                                <TabsTrigger value="numbers" className="text-sm md:text-base">Virtual Numbers</TabsTrigger>
                                <TabsTrigger value="travel" className="text-sm md:text-base">Travel eSIM</TabsTrigger>
                                <TabsTrigger value="api" className="text-sm md:text-base">SMS OTP</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Virtual Numbers Pricing */}
                        <TabsContent value="numbers">
                            <div className="flex justify-center items-center gap-4 mb-10">
                                <span className={`text-sm ${!isAnnual ? "font-bold" : "text-muted-foreground"}`}>Monthly</span>
                                <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
                                <span className={`text-sm ${isAnnual ? "font-bold" : "text-muted-foreground"}`}>
                                    Yearly <Badge variant="secondary" className="ml-1 text-primary">Save 20%</Badge>
                                </span>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Starter Plan */}
                                <Card className="flex flex-col border-muted hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Starter</CardTitle>
                                        <CardDescription>Perfect for solopreneurs & freelancers.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold">{format(pricing.starter)}</span>
                                            <span className="text-muted-foreground">/month</span>
                                            {isAnnual && <div className="text-xs text-muted-foreground mt-1">Billed {format(pricing.starter * 12)} yearly</div>}
                                        </div>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                1 Virtual Number (Local)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Call Forwarding
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Basic Voicemail
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Mobile App Access
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" asChild>
                                            <Link href={`/auth/register?plan=starter&billing=${isAnnual ? 'yearly' : 'monthly'}`}>Get Started</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Professional Plan (Popular) */}
                                <Card className="flex flex-col border-primary shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                                        MOST POPULAR
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Professional</CardTitle>
                                        <CardDescription>For growing small businesses.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold">{format(pricing.professional)}</span>
                                            <span className="text-muted-foreground">/month</span>
                                            {isAnnual && <div className="text-xs text-muted-foreground mt-1">Billed {format(pricing.professional * 12)} yearly</div>}
                                        </div>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                3 Virtual Numbers
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Visual Voicemail (Transcriptions)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Call Recording (1000 mins)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Toll-Free Numbers Available
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Business Hours Routing
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="default" asChild>
                                            <Link href={`/auth/register?plan=professional&billing=${isAnnual ? 'yearly' : 'monthly'}`}>Start Free Trial</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Business Plan */}
                                <Card className="flex flex-col border-muted hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Business</CardTitle>
                                        <CardDescription>Advanced features for teams.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold">{format(pricing.business)}</span>
                                            <span className="text-muted-foreground">/month</span>
                                            {isAnnual && <div className="text-xs text-muted-foreground mt-1">Billed {format(pricing.business * 12)} yearly</div>}
                                        </div>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                10 Virtual Numbers
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                IVR / Auto-Attendant Menu
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Unlimited Call Recording
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Simple Call Analytics
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Priority Support
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="outline" asChild>
                                            <Link href={`/auth/register?plan=business&billing=${isAnnual ? 'yearly' : 'monthly'}`}>Choose Business</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                            <div className="mt-8 text-center text-sm text-muted-foreground">
                                Need more than 10 numbers? <Link href="/company/contact" className="underline text-primary">Contact our enterprise sales team</Link>.
                            </div>
                        </TabsContent>

                        {/* Travel eSIM Pricing */}
                        <TabsContent value="travel">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold mb-4">Regional Data Plans</h3>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Choose the region you're traveling to. All plans include instant activation and work in multiple countries.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-4 gap-6 mb-12">
                                {/* Europe */}
                                <Card className="flex flex-col border-muted hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <Globe className="h-8 w-8 text-blue-500 mb-2" />
                                        <CardTitle className="text-xl">Europe</CardTitle>
                                        <CardDescription>30+ Countries</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex justify-between items-center">
                                                <span>3GB - 30 days</span>
                                                <span className="font-bold">{format(9.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>5GB - 30 days</span>
                                                <span className="font-bold">{format(19.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>10GB - 30 days</span>
                                                <span className="font-bold">{format(33.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>20GB - 30 days</span>
                                                <span className="font-bold">{format(59.50)}</span>
                                            </li>
                                        </ul>
                                        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                                            Avg. $3.20/GB
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" size="sm" asChild>
                                            <Link href="/dashboard/travel?region=europe">Buy Now</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Asia */}
                                <Card className="flex flex-col border-muted hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <Globe className="h-8 w-8 text-green-500 mb-2" />
                                        <CardTitle className="text-xl">Asia</CardTitle>
                                        <CardDescription>25+ Countries</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex justify-between items-center">
                                                <span>3GB - 30 days</span>
                                                <span className="font-bold">{format(11.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>5GB - 30 days</span>
                                                <span className="font-bold">{format(16.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>10GB - 30 days</span>
                                                <span className="font-bold">{format(29.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>20GB - 30 days</span>
                                                <span className="font-bold">{format(49.50)}</span>
                                            </li>
                                        </ul>
                                        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                                            Avg. $2.60/GB
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" size="sm" asChild>
                                            <Link href="/dashboard/travel?region=asia">Buy Now</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Americas */}
                                <Card className="flex flex-col border-primary shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                                        POPULAR
                                    </div>
                                    <CardHeader>
                                        <Globe className="h-8 w-8 text-orange-500 mb-2" />
                                        <CardTitle className="text-xl">Americas</CardTitle>
                                        <CardDescription>USA, Canada, Mexico</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex justify-between items-center">
                                                <span>3GB - 30 days</span>
                                                <span className="font-bold">{format(15.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>5GB - 30 days</span>
                                                <span className="font-bold">{format(23.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>10GB - 30 days</span>
                                                <span className="font-bold">{format(39.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>20GB - 30 days</span>
                                                <span className="font-bold">{format(69.50)}</span>
                                            </li>
                                        </ul>
                                        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                                            Avg. $3.60/GB
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" size="sm" asChild>
                                            <Link href="/dashboard/travel?region=americas">Buy Now</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Global */}
                                <Card className="flex flex-col border-muted hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <Globe className="h-8 w-8 text-purple-500 mb-2" />
                                        <CardTitle className="text-xl">Global</CardTitle>
                                        <CardDescription>150+ Countries</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex justify-between items-center">
                                                <span>3GB - 30 days</span>
                                                <span className="font-bold">{format(21.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>5GB - 30 days</span>
                                                <span className="font-bold">{format(33.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>10GB - 30 days</span>
                                                <span className="font-bold">{format(59.50)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span>20GB - 30 days</span>
                                                <span className="font-bold">{format(99.50)}</span>
                                            </li>
                                        </ul>
                                        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                                            Avg. $5.20/GB
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" size="sm" asChild>
                                            <Link href="/dashboard/travel?region=global">Buy Now</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>

                            <div className="text-center mb-8">
                                <p className="text-sm text-muted-foreground mb-4">
                                    All plans include: Instant activation • No physical SIM • Hotspot enabled • 24/7 support
                                </p>
                            </div>

                            {/* Popular Bundles */}
                            <div className="bg-secondary/20 rounded-xl p-8">
                                <h4 className="text-2xl font-bold text-center mb-6">Popular Travel Bundles</h4>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <Card className="border-muted">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Weekend Getaway</CardTitle>
                                            <CardDescription>Europe - 7 days</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="mb-4">
                                                <span className="text-3xl font-bold">{format(9.50)}</span>
                                            </div>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-primary" />
                                                    2GB Data
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-primary" />
                                                    30+ Countries
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" variant="outline" size="sm" asChild>
                                                <Link href="/dashboard/travel?bundle=weekend">Select</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>

                                    <Card className="border-primary">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Business Trip</CardTitle>
                                            <CardDescription>Americas - 14 days</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="mb-4">
                                                <span className="text-3xl font-bold">{format(29.50)}</span>
                                            </div>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-primary" />
                                                    7GB Data
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-primary" />
                                                    USA, Canada, Mexico
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" size="sm" asChild>
                                                <Link href="/dashboard/travel?bundle=business">Select</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>

                                    <Card className="border-muted">
                                        <CardHeader>
                                            <CardTitle className="text-lg">World Explorer</CardTitle>
                                            <CardDescription>Global - 90 days</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="mb-4">
                                                <span className="text-3xl font-bold">{format(86.50)}</span>
                                            </div>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-primary" />
                                                    15GB Data
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-primary" />
                                                    150+ Countries
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" variant="outline" size="sm" asChild>
                                                <Link href="/dashboard/travel?bundle=explorer">Select</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>

                            <div className="text-center mt-8">
                                <Link href="/product/travel-esim">
                                    <Button variant="outline">View All Destinations & Rates</Button>
                                </Link>
                            </div>
                        </TabsContent>

                        {/* SMS OTP Pricing */}
                        <TabsContent value="api">
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold mb-4">Simple Bundle Pricing</h3>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Choose a plan that fits your verification needs. No hidden fees, no surprises.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 mb-12">
                                {/* Starter Bundle */}
                                <Card className="flex flex-col border-muted hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Starter</CardTitle>
                                        <CardDescription>Perfect for small projects</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold">{format(6.50)}</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                100 OTP Messages
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Global Coverage (150+ countries)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                99.9% Delivery Rate
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Easy Dashboard
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Email Support
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" asChild>
                                            <Link href="/auth/register?plan=otp-starter">Get Started</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Growth Bundle (Popular) */}
                                <Card className="flex flex-col border-primary shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                                        MOST POPULAR
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Growth</CardTitle>
                                        <CardDescription>For growing businesses</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold">{format(21.50)}</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                500 OTP Messages
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Global Coverage (150+ countries)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                99.9% Delivery Rate
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Advanced Analytics
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Priority Support
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Custom Sender ID
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="default" asChild>
                                            <Link href="/auth/register?plan=otp-growth">Start Free Trial</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Business Bundle */}
                                <Card className="flex flex-col border-muted hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Business</CardTitle>
                                        <CardDescription>High-volume verification</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold">{format(61.50)}</span>
                                            <span className="text-muted-foreground">/month</span>
                                        </div>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                2,000 OTP Messages
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Global Coverage (150+ countries)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                99.9% Delivery Rate
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Advanced Analytics
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                Dedicated Support
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                API Access (Optional)
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="outline" asChild>
                                            <Link href="/auth/register?plan=otp-business">Choose Business</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-4">
                                    Need more than 2,000 messages per month?
                                </p>
                                <Link href="/company/contact">
                                    <Button variant="outline">Contact Sales for Enterprise</Button>
                                </Link>
                            </div>

                            <Card className="mt-8 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 max-w-2xl mx-auto">
                                <CardContent className="p-6">
                                    <p className="text-sm text-center">
                                        <strong>For Developers:</strong> Need programmatic API access?
                                        Check out our <Link href="/docs/sms" className="underline text-primary">API documentation</Link> for
                                        pay-as-you-go pricing starting at $0.0065/message.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* FAQ Section */}
                <div className="container mx-auto px-4 mt-24 max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                            <AccordionContent>
                                Yes, you can cancel your subscription at any time from your dashboard. Your number will remain active until the end of the current billing period.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Are there any setup fees?</AccordionTrigger>
                            <AccordionContent>
                                No, there are no setup fees for our virtual number plans or travel eSIMs. You simply pay the monthly subscription or data rate.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Do you offer refunds for travel eSIMs?</AccordionTrigger>
                            <AccordionContent>
                                If your eSIM fails to connect or activate due to a technical issue on our end, we will provide a full refund.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Is the SMS OTP pricing global?</AccordionTrigger>
                            <AccordionContent>
                                Yes, our SMS OTP bundles work globally in 150+ countries. However, developers using our API may see varying rates by destination country. Check our API documentation for specific international rates.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </main>
            <LandingFooter />
        </div>
    );
}
