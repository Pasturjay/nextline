"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Check, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NumberRetentionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    phoneNumber: string;
}

export function NumberRetentionModal({ open, onOpenChange, phoneNumber }: NumberRetentionModalProps) {
    const router = useRouter();

    const handleGetOwnNumber = () => {
        // Navigate to buy-number page
        router.push(`/dashboard/buy-number`);
        onOpenChange(false);
    };

    const handleDismiss = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        💡 Want Your Own Private Number?
                    </DialogTitle>
                    <DialogDescription className="text-base pt-2">
                        <strong className="text-foreground font-mono">{phoneNumber}</strong> is a shared number for temporary verification only.
                        Get your own dedicated number for private use!
                    </DialogDescription>
                </DialogHeader>

                <Alert variant="default" className="bg-yellow-500/10 border-yellow-500/30">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ This shared number cannot be kept permanently. It's for verification only.
                    </AlertDescription>
                </Alert>

                <div className="space-y-3 py-4">
                    <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="font-medium">Your own private number</p>
                            <p className="text-sm text-muted-foreground">Not shared with anyone else</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="font-medium">Unlimited use</p>
                            <p className="text-sm text-muted-foreground">Calls, SMS, and verification</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <p className="font-medium">From $5/month</p>
                            <p className="text-sm text-muted-foreground">Or $15 one-time for 30 days</p>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Get a Dedicated Number</p>
                            <p className="text-sm text-muted-foreground">Choose from 150+ countries</p>
                        </div>
                        <Badge variant="default">Recommended</Badge>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={handleDismiss} className="w-full sm:w-auto">
                        <X className="mr-2 h-4 w-4" />
                        Maybe Later
                    </Button>
                    <Button onClick={handleGetOwnNumber} className="w-full sm:w-auto">
                        <Phone className="mr-2 h-4 w-4" />
                        Get My Own Number
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
