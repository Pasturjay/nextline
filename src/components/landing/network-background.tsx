"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export function NetworkBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        setCanvasSize();

        const particles: Particle[] = [];
        // Reduced from 80 to 35 particles
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 30000), 35);

        // Create particles - single color, no special effects
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.15, // Slower movement (was 0.3)
                vy: (Math.random() - 0.5) * 0.15,
            });
        }

        let animationFrameId: number;

        const animate = () => {
            if (!ctx || !canvas) return;

            // Clear canvas completely (no trail effect)
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach((particle, index) => {
                // Move particle
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                // Draw simple node (no glow)
                ctx.fillStyle = "rgba(150, 150, 150, 0.3)"; // Subtle gray
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                ctx.fill();

                // Draw connections (simple, no gradient)
                particles.forEach((otherParticle, otherIndex) => {
                    if (index >= otherIndex) return;

                    const dx = otherParticle.x - particle.x;
                    const dy = otherParticle.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 120; // Shorter connection distance

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.15; // Much more subtle

                        ctx.strokeStyle = `rgba(150, 150, 150, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            setCanvasSize();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ width: "100%", height: "100%", opacity: 0.5 }}
        />
    );
}
