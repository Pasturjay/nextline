"use client";

import React, { useState, useEffect, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/checkout/checkout-form";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PayPalButton } from "@/components/checkout/paypal-button";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

// Use public key from env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
    const [clientSecret, setClientSecret] = useState("");

    const phoneNumber = searchParams.get("phoneNumber");
    const country = searchParams.get("country");
    const price = parseFloat(searchParams.get("price") || "0");
    const setup = parseFloat(searchParams.get("setup") || "0");
    const billing = searchParams.get("billing") || "monthly";
    const total = price + setup;

    useEffect(() => {
        if (total > 0 && paymentMethod === 'stripe') {
            // Create PaymentIntent as soon as the page loads if Stripe is selected
            fetch("/api/checkout/create-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: [{
                        id: phoneNumber,
                        price: total
                    }],
                    currency: "usd",
                    metadata: {
                        phoneNumber,
                        country,
                        type: searchParams.get("type") || "number_purchase",
                        duration: searchParams.get("duration") || "monthly",
                        billing: searchParams.get("billing") || "monthly"
                    }
                }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret));
        }
    }, [total, phoneNumber, country, searchParams, paymentMethod]);

    const handleSuccess = async (paymentIntentIdOrOrderId: string) => {
        // Upon successful payment, provision the number
        try {
            const res = await fetch("/api/numbers/provision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phoneNumber,
                    country,
                    paymentId: paymentIntentIdOrOrderId,
                    provider: paymentMethod
                })
            });

            if (!res.ok) throw new Error("Failed to provision number");

            toast.success("Number provisioned successfully!");
            router.push("/dashboard/numbers");
        } catch (error) {
            console.error(error);
            toast.error("Payment successful but provisioning failed. Support has been notified.");
        }
    };

    const appearance = {
        theme: 'stripe' as const,
    };
    const options = {
        clientSecret,
        appearance,
    };

    if (!phoneNumber) {
        return <div>Invalid checkout session. Missing phone number.</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>Review your purchase details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Virtual Number</span>
                            <span>{phoneNumber} ({country})</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                {billing === 'one-time' ? 'One-Time Charge (30 Days)' : 'Monthly Subscription'}
                            </span>
                            <span>${price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Setup Fee (One-time)</span>
                            <span>${setup.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t font-bold text-lg">
                            <span>Total Due</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Travel Benefits Section */}
                {searchParams.get("type") === "RENTAL" && (
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardHeader>
                            <CardTitle className="text-blue-700 dark:text-blue-300">Why this is a great choice</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-2">
                                <div className="h-5 w-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">✓</div>
                                <div className="text-sm"><span className="font-semibold block">Zero Roaming Fees</span> Receive calls on the app over data/WiFi.</div>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-5 w-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">✓</div>
                                <div className="text-sm"><span className="font-semibold block">Instant Activation</span> Your number is ready to use immediately.</div>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-5 w-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">✓</div>
                                <div className="text-sm"><span className="font-semibold block">Local Presence</span> Locals can call you at standard rates.</div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>Secure payment via {paymentMethod === 'stripe' ? 'Stripe' : 'PayPal'}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Payment Method Selector */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentMethod('stripe')}
                                className={`p-4 border rounded-lg flex items-center justify-center transition-all ${paymentMethod === 'stripe' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
                            >
                                <span className="font-semibold">Card</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('paypal')}
                                className={`p-4 border rounded-lg flex items-center justify-center transition-all ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10 ring-1 ring-blue-500' : 'border-border hover:border-blue-500/50'}`}
                            >
                                <span className="font-semibold text-[#003087]">PayPal</span>
                            </button>
                        </div>

                        {paymentMethod === 'stripe' ? (
                            <>
                                {clientSecret && (
                                    <Elements options={options} stripe={stripePromise}>
                                        <CheckoutForm amount={total} onSuccess={handleSuccess} />
                                    </Elements>
                                )}
                                {!clientSecret && <div>Loading payment details...</div>}
                            </>
                        ) : (
                            <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test" }}>
                                <PayPalButton
                                    amount={total}
                                    onSuccess={handleSuccess}
                                    metadata={{
                                        phoneNumber,
                                        country,
                                        type: searchParams.get("type"),
                                        duration: searchParams.get("duration"),
                                        billing
                                    }}
                                />
                            </PayPalScriptProvider>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
