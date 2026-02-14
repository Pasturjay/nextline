"use client";

import { useEffect, useRef, useState } from "react";

interface MetricCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    label: string;
    className?: string;
}

export function MetricCounter({
    end,
    duration = 1500, // Faster animation
    suffix = "",
    prefix = "",
    decimals = 0,
    label,
    className = ""
}: MetricCounterProps) {
    const [count, setCount] = useState(0);
    const countUpRef = useRef<boolean>(false);

    useEffect(() => {
        if (countUpRef.current) return;

        countUpRef.current = true;
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Simple linear easing
            const currentValue = startValue + (end - startValue) * progress;
            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    const formattedCount = count.toFixed(decimals);

    return (
        <div className={`text-center ${className}`}>
            <div className="text-3xl md:text-4xl font-bold text-foreground">
                {prefix}{formattedCount}{suffix}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </div>
    );
}
