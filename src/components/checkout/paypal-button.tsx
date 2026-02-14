"use client";

import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PayPalButtonProps {
    amount: number;
    onSuccess: (orderId: string) => void;
    metadata?: any;
}

export function PayPalButton({ amount, onSuccess, metadata }: PayPalButtonProps) {
    const [{ isPending, isResolved, options }, dispatch] = usePayPalScriptReducer();

    // useEffect(() => {
    //     dispatch({
    //         type: "resetOptions",
    //         value: {
    //             ...options,
    //             currency: "USD",
    //         },
    //     });
    // }, [amount]);

    const createOrder = async () => {
        try {
            const response = await fetch("/api/checkout/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: [
                        {
                            description: "Virtual Number Purchase",
                            amount: {
                                currency_code: "USD",
                                value: amount.toFixed(2),
                            },
                        },
                    ],
                    metadata,
                }),
            });

            const order = await response.json();

            if (order.id) {
                return order.id;
            } else {
                throw new Error(order.error || "Failed to create PayPal order");
            }
        } catch (error: any) {
            console.error("PayPal Create Order Error:", error);
            toast.error("Could not initiate PayPal checkout");
            throw error;
        }
    };

    const onApprove = async (data: any) => {
        try {
            const response = await fetch("/api/checkout/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderID: data.orderID,
                }),
            });

            const orderData = await response.json();

            if (orderData.status === "COMPLETED") {
                toast.success("Payment successful!");
                onSuccess(orderData.id);
            } else {
                toast.error("Payment not completed. Status: " + orderData.status);
            }
        } catch (error) {
            console.error("PayPal Capture Error:", error);
            toast.error("Payment failed during capture");
        }
    };

    if (isPending) {
        return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    return (
        <PayPalButtons
            style={{ layout: "vertical", shape: "rect", label: "pay" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(err) => {
                console.error("PayPal Error:", err);
                toast.error("PayPal encountered an error");
            }}
        />
    );
}
