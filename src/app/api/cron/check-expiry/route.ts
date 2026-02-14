import { NextResponse } from "next/server";
import { checkExpiredRentals } from "@/lib/travel/expiry";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    // Simple auth to prevent abuse
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const count = await checkExpiredRentals();
        return NextResponse.json({ message: "Expiry check completed", expiredCount: count });
    } catch (error) {
        console.error("Cron Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
