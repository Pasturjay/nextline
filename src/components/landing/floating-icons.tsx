import { Phone, MessageSquare, Globe, Radio, Smartphone, Wifi, Signal } from "lucide-react";

export function FloatingIcons() {
    return (
        <>
            {/* Floating Communication Icons */}
            <div className="absolute top-[15%] left-[8%] animate-float opacity-30 hidden md:block">
                <Phone className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <div className="absolute top-[25%] right-[12%] animate-float-delayed opacity-25 hidden md:block">
                <MessageSquare className="w-14 h-14 text-blue-500" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-[30%] left-[15%] animate-float opacity-20 hidden lg:block" style={{ animationDelay: '0.5s' }}>
                <Globe className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
            <div className="absolute top-[45%] right-[10%] animate-float-delayed opacity-15 hidden lg:block">
                <Radio className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-[20%] right-[20%] animate-float opacity-25 hidden md:block" style={{ animationDelay: '1.5s' }}>
                <Smartphone className="w-11 h-11 text-primary" strokeWidth={1.5} />
            </div>
            <div className="absolute top-[18%] right-[28%] animate-float-delayed opacity-20 hidden lg:block" style={{ animationDelay: '2s' }}>
                <Wifi className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-[35%] left-[25%] animate-float opacity-30 hidden md:block" style={{ animationDelay: '1s' }}>
                <Signal className="w-9 h-9 text-primary" strokeWidth={1.5} />
            </div>
            <div className="absolute top-[60%] left-[5%] animate-float-delayed opacity-15 hidden lg:block" style={{ animationDelay: '0.8s' }}>
                <MessageSquare className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
            </div>

            {/* Pulsing Signal Rings */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                <div className="w-[400px] h-[400px] border border-primary/10 rounded-full animate-ping-slow" />
                <div className="absolute inset-0 w-[400px] h-[400px] border border-blue-500/10 rounded-full animate-ping-slow" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
                <div className="w-[300px] h-[300px] border border-primary/8 rounded-full animate-ping-slow" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Custom Animations */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(5deg); }
                }
                @keyframes ping-slow {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.15); opacity: 0.2; }
                    100% { transform: scale(1.3); opacity: 0; }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                }
                .animate-ping-slow {
                    animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
            `}</style>
        </>
    );
}
