import NumberSearchInterface from "@/components/dashboard/number-search";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Phone } from "lucide-react";

interface BuyNumberPageProps {
    searchParams: Promise<{
        retain?: string;
    }>;
}

export default async function BuyNumberPage({ searchParams }: BuyNumberPageProps) {
    const { retain: retainNumber } = await searchParams;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Buy Virtual Numbers</h2>
                <p className="text-muted-foreground">
                    Search and provision local, mobile, and toll-free numbers from over 150 countries.
                </p>
            </div>

            {/* Retention banner */}
            {retainNumber && (
                <Alert className="border-primary/50 bg-primary/5">
                    <Phone className="h-4 w-4" />
                    <AlertTitle>Keep Your OTP Number</AlertTitle>
                    <AlertDescription>
                        Complete your purchase to keep <strong className="font-mono">{retainNumber}</strong> permanently for calls, SMS, and more!
                    </AlertDescription>
                </Alert>
            )}

            <NumberSearchInterface retainNumber={retainNumber} />
        </div>
    );
}
