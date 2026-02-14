"use client"

import * as React from "react"
import { Phone, PhoneOff, Mic, MicOff, Grid3X3, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function WebPhone() {
    const [isOpen, setIsOpen] = React.useState(false) // Whether phone is minimized/maximized
    const [callStatus, setCallStatus] = React.useState<"IDLE" | "RINGING" | "CONNECTED">("IDLE")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [isMuted, setIsMuted] = React.useState(false)
    const [duration, setDuration] = React.useState(0)
    const timerRef = React.useRef<NodeJS.Timeout | null>(null)

    // Clear timer on unmount
    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    React.useEffect(() => {
        if (callStatus === "CONNECTED") {
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1)
            }, 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
            setDuration(0)
        }
    }, [callStatus])

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60)
        const seconds = secs % 60
        return `${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    const handleCall = () => {
        if (phoneNumber) {
            setCallStatus("CONNECTED")
        }
    }

    const handleHangup = async () => {
        // Log the call if we were connected
        if (callStatus === "CONNECTED") {
            try {
                await fetch("/api/calls/dial", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        toNumber: phoneNumber,
                        duration: duration
                    })
                });
            } catch (error) {
                console.error("Failed to log call", error);
            }
        }

        setCallStatus("IDLE")
        setIsMuted(false)
    }

    return (
        <div className={cn(
            "fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",
            isOpen ? "w-80" : "w-auto"
        )}>
            {!isOpen && (
                <Button
                    className={cn("h-14 w-14 rounded-full shadow-lg", callStatus === "RINGING" && "animate-bounce bg-green-500 hover:bg-green-600")}
                    onClick={() => setIsOpen(true)}
                >
                    <Phone className="h-6 w-6" />
                </Button>
            )}

            {isOpen && (
                <Card className="border-primary/20 shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
                        <CardTitle className="text-sm font-medium">
                            {callStatus === "IDLE" && "Web Phone"}
                            {callStatus === "CONNECTED" && "Connected"}
                        </CardTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                            <div className="h-[2px] w-4 bg-current" />
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {callStatus === "IDLE" && (
                            <div className="space-y-4">
                                <Input
                                    placeholder="Enter number..."
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="text-center text-lg tracking-widest"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Dialpad placeholder */}
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
                                        <Button key={key} variant="outline" className="h-10 text-lg font-mono" onClick={() => setPhoneNumber(prev => prev + key)}>
                                            {key}
                                        </Button>
                                    ))}
                                </div>
                                <Button className="w-full bg-green-500 hover:bg-green-600" onClick={handleCall}>
                                    <Phone className="mr-2 h-4 w-4" /> Call
                                </Button>
                            </div>
                        )}

                        {callStatus === "CONNECTED" && (
                            <div className="text-center space-y-6 py-4">
                                <div className="text-2xl font-mono text-green-500">{formatTime(duration)}</div>
                                <h3 className="text-lg font-semibold">{phoneNumber}</h3>

                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    <Button variant="outline" size="icon" className={cn(isMuted && "bg-muted")} onClick={() => setIsMuted(!isMuted)}>
                                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={handleHangup}>
                                        <PhoneOff className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="bg-muted/20 py-2">
                        <div className="flex items-center text-xs text-muted-foreground w-full justify-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                            Online (VoIP Ready)
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
