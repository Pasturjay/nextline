"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";

const smsMessages = [
    { id: 1, sender: "+1 (415) 555-0123", preview: "Your verification code is 482910", time: "Just now", flag: "🇺🇸" },
    { id: 2, sender: "+44 20 7946 0958", preview: "Meeting confirmed for 3 PM GMT", time: "2m ago", flag: "🇬🇧" },
    { id: 3, sender: "+81 3-1234-5678", preview: "お問い合わせありがとうございます", time: "5m ago", flag: "🇯🇵" },
    { id: 4, sender: "+49 30 901820", preview: "Ihre Bestellung wurde versendet", time: "8m ago", flag: "🇩🇪" },
    { id: 5, sender: "+33 1 42 68 53 00", preview: "Bienvenue chez NexaLine! Votre numéro...", time: "12m ago", flag: "🇫🇷" },
    { id: 6, sender: "+61 2 9374 4000", preview: "Payment of $49.99 received. Thanks!", time: "15m ago", flag: "🇦🇺" },
];

const SmsInboxAnimation = () => {
    const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        const startCycle = () => {
            setVisibleMessages([]);

            smsMessages.forEach((_, index) => {
                const timer = setTimeout(() => {
                    setVisibleMessages((prev) => [...prev, index]);
                }, index * 900 + 400);
                timers.push(timer);
            });

            // Restart cycle
            const resetTimer = setTimeout(() => {
                startCycle();
            }, smsMessages.length * 900 + 3000);
            timers.push(resetTimer);
        };

        startCycle();
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="relative w-[280px] h-[520px] mx-auto">
            {/* Phone frame */}
            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-border bg-background overflow-hidden shadow-[0_0_60px_hsl(var(--primary)/0.15)]">
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 pt-3 pb-2">
                    <span className="text-[10px] font-mono text-muted-foreground">9:41</span>
                    <div className="w-20 h-5 rounded-full bg-muted" />
                    <div className="flex gap-1">
                        <div className="w-3.5 h-2 rounded-sm bg-muted-foreground/40" />
                        <div className="w-1 h-2 rounded-sm bg-muted-foreground/40" />
                    </div>
                </div>

                {/* Header */}
                <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-primary" />
                        <span className="text-sm font-semibold text-foreground">Messages</span>
                        <span className="ml-auto text-xs font-mono text-primary">
                            {visibleMessages.length}
                        </span>
                    </div>
                </div>

                {/* Message list */}
                <div className="px-3 py-2 space-y-1 overflow-hidden h-[400px]">
                    <AnimatePresence>
                        {visibleMessages.map((index) => {
                            const msg = smsMessages[index];
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: 60, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="p-3 cursor-pointer rounded-xl border border-border bg-card hover:bg-accent/5 transition-colors"
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg leading-none">{msg.flag}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-mono text-foreground font-medium truncate">
                                                    {msg.sender}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground ml-1 whitespace-nowrap">
                                                    {msg.time}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                                {msg.preview}
                                            </p>
                                        </div>
                                    </div>
                                    {index === 0 && (
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="h-[2px] bg-primary/40 rounded-full mt-2"
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SmsInboxAnimation;
