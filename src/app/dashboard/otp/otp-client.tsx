"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OtpClientProps {
    hasUsedFree: boolean;
    currentNumber?: string;
}

export function OtpClient({ hasUsedFree, currentNumber: initialNumber }: OtpClientProps) {
    const [loading, setLoading] = useState(false);
    const [currentNumber, setCurrentNumber] = useState<string | undefined>(initialNumber);
    const router = useRouter();

    const generateOtpNumber = async () => {
        if (hasUsedFree) {
            toast("Free trial used", {
                description: "Get your own dedicated number for unlimited use!",
                // variant: "destructive" - sonner doesn't use variant in options usually, but let's check. 
                // actually shadcn sonner might. But typically it's toast.error.
                // Let's stick to simple signature first.
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/otp/generate', {
                method: 'POST'
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403) {
                    // Free trial used
                    toast("Free trial used", {
                        description: data.message || "Get your own dedicated number for unlimited use!",
                        action: (
                            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/buy-number')}>
                                Buy Number
                            </Button>
                        ),
                    });
                    return;
                }
                throw new Error(data.error || 'Failed to generate number');
            }

            setCurrentNumber(data.phoneNumber);

            toast("✅ OTP Number Ready!", {
                description: data.message || `Use ${data.phoneNumber} for verification`,
            });

        } catch (error) {
            toast("Error", {
                description: "Failed to generate OTP number. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Current number display */}
            {currentNumber && (
                <div className="p-6 border border-primary/30 rounded-lg bg-primary/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">Shared OTP Number:</p>
                        <Check className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-3xl font-mono font-bold text-primary mb-4">{currentNumber}</p>
                    <Alert variant="default" className="bg-yellow-500/10 border-yellow-500/30">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200">
                            ⚠️ This number is shared with others. For private use, <a href="/dashboard/buy-number" className="underline font-semibold">get your own number</a>.
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Generate button */}
            <Button
                onClick={generateOtpNumber}
                disabled={loading || hasUsedFree}
                size="lg"
                className="w-full"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                ) : hasUsedFree ? (
                    <>
                        <Phone className="mr-2 h-4 w-4" />
                        Free Trial Used - Buy Number
                    </>
                ) : (
                    <>
                        <Phone className="mr-2 h-4 w-4" />
                        Get Instant OTP Number
                    </>
                )}
            </Button>

            {hasUsedFree && (
                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        You've used your free verification. Want unlimited access?
                    </p>
                    <Button variant="outline" onClick={() => router.push('/dashboard/buy-number')}>
                        Get Your Own Number →
                    </Button>
                </div>
            )}
        </div>
    );
}
