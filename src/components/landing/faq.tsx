"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    {
        question: "What exactly is a Virtual Number?",
        answer: "Think of it as a second phone number that lives in an app instead of on a SIM card. You can use it to make calls and receive texts from anywhere in the world, just like a regular number. It's perfect for separating business calls from personal ones or appearing local in another country."
    },
    {
        question: "How does the Travel eSIM work?",
        answer: "It's a digital data plan for your phone. Instead of finding a shop to buy a SIM card when you land in a new country, you scan a QR code we give you, and boom—you have internet. It works alongside your main number, so you can still get your regular calls."
    },
    {
        question: "Can I use NexaLine for my business?",
        answer: "Absolutely! NexaLine is built for businesses. You can get numbers for your entire team, track who is calling, and even set up things like 'Press 1 for Sales'. It helps you look professional and stay organized."
    },
    {
        question: "Do I need to be a developer to use this?",
        answer: "Not at all. We have an easy-to-use dashboard where you can click to buy numbers, view messages, and manage your account. If you ARE a developer, we have powerful tools (APIs) for you too."
    },
    {
        question: "Is there a long-term contract?",
        answer: "No contracts. You can pay month-to-month for numbers and cancel anytime. Travel eSIMs are one-time purchases for your trip. We believe in keeping things flexible and simple."
    },
    {
        question: "Can I keep my number if I switch phones?",
        answer: "Yes! Since your number is in your account (in the cloud), you just log in on your new device and your number is there. You never lose it as long as your subscription is active."
    }
];

export function LandingFAQ() {
    return (
        <section id="faq" className="py-24 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Common Questions, <span className="text-primary">Simple Answers</span>.
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to know about how NexaLine works in real life.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-lg font-medium text-left">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
