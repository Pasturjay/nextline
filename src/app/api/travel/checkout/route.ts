import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { addDays } from "date-fns";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { phoneNumber, country, duration, price, forwardToNumber } = await req.json();

        if (!phoneNumber || !duration || !price) {
            return new NextResponse("Invalid request data", { status: 400 });
        }

        // 1. Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(price * 100),
            currency: "usd",
            metadata: {
                userId: session.user.id,
                phoneNumber,
                country,
                duration,
                type: "travel_rental",
                forwardToNumber
            }
        });

        // 2. Create Pending Rental Record
        // Calculate expiry roughly for the record, though confirmed on webhook
        const days = parseInt(duration);
        const expiresAt = addDays(new Date(), days);

        await prisma.travelRental.create({
            data: {
                userId: session.user.id,
                phoneNumber,
                country,
                duration,
                price,
                forwardToNumber: forwardToNumber || "",
                status: "PENDING",
                expiresAt,
                paymentIntentId: paymentIntent.id
            }
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Travel Checkout Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
