"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Globe, Phone, Map, Code, Users, Building2, BookOpen, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

export function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-background/80 backdrop-blur-md border-border/50 shadow-sm" : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link className="flex items-center gap-2" href="/">
                    <div className="p-1.5 bg-primary rounded-lg">
                        <Globe className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">NexaLine</span>
                </Link>

                <div className="hidden md:flex items-center justify-center flex-1">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {/* Products Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <a
                                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                    href="/product/virtual-numbers"
                                                >
                                                    <Phone className="h-6 w-6" />
                                                    <div className="mb-2 mt-4 text-lg font-medium">
                                                        Virtual Numbers
                                                    </div>
                                                    <p className="text-sm leading-tight text-muted-foreground">
                                                        Local, toll-free, and mobile numbers in 50+ countries.
                                                    </p>
                                                </a>
                                            </NavigationMenuLink>
                                        </li>
                                        <ListItem href="/product/travel-esim" title="Travel eSIM">
                                            Stay connected globally without roaming fees.
                                        </ListItem>
                                        <ListItem href="/dashboard/otp" title="Instant OTP">
                                            Get free verification codes instantly.
                                        </ListItem>
                                        <ListItem href="/pricing" title="View Pricing">
                                            Simple, transparent pricing for all services.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Solutions Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                        <ListItem href="/use-cases#business" title="Global Business">
                                            Establish a local presence anywhere.
                                        </ListItem>
                                        <ListItem href="/use-cases#travel" title="Travel Connectivity">
                                            Seamless data for your trips.
                                        </ListItem>
                                        <ListItem href="/use-cases#otp" title="OTP Verification">
                                            Secure authentication for apps.
                                        </ListItem>
                                        <ListItem href="/use-cases#engagement" title="Customer Engagement">
                                            Reach customers where they are.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Company Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                        <ListItem href="/use-cases" title="Use Cases">
                                            Explore real-world applications.
                                        </ListItem>
                                        <ListItem href="/company/about" title="About Us">
                                            Our mission and values.
                                        </ListItem>
                                        <ListItem href="/company/blog" title="Blog">
                                            Latest news and industry insights.
                                        </ListItem>
                                        <ListItem href="/company/careers" title="Careers">
                                            Join our growing team.
                                        </ListItem>
                                        <ListItem href="/company/contact" title="Contact">
                                            Get in touch with support.
                                        </ListItem>
                                        <ListItem href="/company/faq" title="FAQ">
                                            Common questions and answers.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/pricing" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Pricing
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/developers" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Developers
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/auth/signin">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button size="sm" className="font-semibold shadow-lg shadow-primary/20">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";
