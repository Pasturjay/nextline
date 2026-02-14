"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, MicOff, Volume2 } from "lucide-react";

type CallState = "idle" | "ringing" | "connected" | "ended";

const PhoneCallAnimation = () => {
    const [callState, setCallState] = useState<CallState>("idle");
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const runCycle = () => {
            setCallState("idle");
            setDuration(0);
            const t1 = setTimeout(() => setCallState("ringing"), 800);
            const t2 = setTimeout(() => setCallState("connected"), 3800);
            const t3 = setTimeout(() => setCallState("ended"), 8800);
            const t4 = setTimeout(() => runCycle(), 11000);
            return [t1, t2, t3, t4];
        };
        const timers = runCycle();
        return () => timers.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        if (callState !== "connected") return;
        setDuration(0);
        const interval = setInterval(() => setDuration((d) => d + 1), 1000);
        return () => clearInterval(interval);
    }, [callState]);

    const formatDuration = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

    return (
        <div className="relative w-[280px] h-[520px] mx-auto">
            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-border bg-background overflow-hidden shadow-[0_0_60px_hsl(var(--secondary)/0.15)]">
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 pt-3 pb-2">
                    <span className="text-[10px] font-mono text-muted-foreground">9:41</span>
                    <div className="w-20 h-5 rounded-full bg-muted" />
                    <div className="flex gap-1">
                        <div className="w-3.5 h-2 rounded-sm bg-muted-foreground/40" />
                        <div className="w-1 h-2 rounded-sm bg-muted-foreground/40" />
                    </div>
                </div>

                {/* Call content */}
                <div className="flex flex-col items-center justify-between h-[460px] px-6 py-6">
                    {/* Caller info */}
                    <div className="flex flex-col items-center text-center mt-4">
                        {/* Avatar with rings */}
                        <div className="relative mb-4">
                            <motion.div
                                className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center"
                                animate={callState === "ringing" ? { scale: [1, 1.05, 1] } : {}}
                                transition={{ duration: 0.6, repeat: Infinity }}
                            >
                                <span className="text-3xl">🇬🇧</span>
                            </motion.div>

                            {/* Pulse rings for ringing */}
                            <AnimatePresence>
                                {callState === "ringing" && (
                                    <>
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute inset-0 rounded-full border-2 border-primary/40"
                                                initial={{ scale: 1, opacity: 0.6 }}
                                                animate={{ scale: 2.2, opacity: 0 }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    delay: i * 0.5,
                                                    ease: "easeOut",
                                                }}
                                            />
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Connected indicator */}
                            {callState === "connected" && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                                >
                                    <Phone size={10} className="text-white" />
                                </motion.div>
                            )}
                        </div>

                        <h3 className="font-bold text-lg text-foreground">
                            +44 20 7946 0958
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">London, United Kingdom</p>

                        {/* Status */}
                        <motion.div
                            key={callState}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3"
                        >
                            {callState === "idle" && (
                                <span className="text-xs font-mono text-muted-foreground">Connecting...</span>
                            )}
                            {callState === "ringing" && (
                                <span className="text-xs font-mono text-primary animate-pulse">
                                    Ringing...
                                </span>
                            )}
                            {callState === "connected" && (
                                <span className="text-xs font-mono text-green-500">
                                    Connected · {formatDuration(duration)}
                                </span>
                            )}
                            {callState === "ended" && (
                                <span className="text-xs font-mono text-destructive">Call Ended</span>
                            )}
                        </motion.div>
                    </div>

                    {/* Audio wave for connected state */}
                    <AnimatePresence>
                        {callState === "connected" && (
                            <motion.div
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                exit={{ opacity: 0, scaleY: 0 }}
                                className="flex items-center gap-[3px] h-10"
                            >
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-[3px] rounded-full bg-primary/60"
                                        animate={{
                                            height: [4, 8 + Math.random() * 24, 4],
                                        }}
                                        transition={{
                                            duration: 0.4 + Math.random() * 0.4,
                                            repeat: Infinity,
                                            delay: i * 0.05,
                                            ease: "easeInOut",
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action buttons */}
                    <div className="w-full">
                        {(callState === "ringing" || callState === "connected") && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-center gap-6"
                            >
                                {callState === "connected" && (
                                    <>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
                                                <MicOff size={18} className="text-muted-foreground" />
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">Mute</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center">
                                                <Volume2 size={18} className="text-muted-foreground" />
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">Speaker</span>
                                        </div>
                                    </>
                                )}

                                {callState === "ringing" && (
                                    <div className="flex flex-col items-center gap-1">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 0.8, repeat: Infinity }}
                                            className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center"
                                        >
                                            <Phone size={22} className="text-white" />
                                        </motion.div>
                                        <span className="text-[10px] text-green-500">Accept</span>
                                    </div>
                                )}

                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-14 h-14 rounded-full bg-destructive flex items-center justify-center">
                                        <PhoneOff size={22} className="text-destructive-foreground" />
                                    </div>
                                    <span className="text-[10px] text-destructive">
                                        {callState === "ringing" ? "Decline" : "End"}
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        {callState === "ended" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center"
                            >
                                <p className="text-xs text-muted-foreground font-mono">
                                    Duration: {formatDuration(duration)}
                                </p>
                            </motion.div>
                        )}

                        {callState === "idle" && (
                            <div className="flex justify-center">
                                <motion.div
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="flex gap-1"
                                >
                                    {[0, 1, 2].map((i) => (
                                        <div key={i} className="w-2 h-2 rounded-full bg-primary" />
                                    ))}
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneCallAnimation;
