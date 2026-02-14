import { NextResponse } from 'next/server';
import { avoxiClient } from '@/lib/avoxi/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country') || 'US';

    try {
        // Travel numbers are typically mobile numbers for SMS/Data compatibility coverage
        // We search for mobile numbers in the requested country
        const numbers = await avoxiClient.searchNumbers({
            country_code: country,
            type: 'mobile',
            limit: 20
        });

        // Map results to include Travel Rental specific pricing
        // In a real app, pricing would come from a DB configuration or Pricing Service
        const travelFriendlyNumbers = (numbers.numbers || []).map((num: any) => ({
            phoneNumber: num.phoneNumber,
            country: num.country,
            countryCode: num.countryCode,
            region: num.region || num.city,
            type: 'travel_mobile',
            packages: [
                { duration: '7d', price: 10.00, label: '7 Days' },
                { duration: '30d', price: 30.00, label: '30 Days' },
                { duration: '60d', price: 55.00, label: '60 Days' },
                { duration: '90d', price: 80.00, label: '90 Days' },
                { duration: '365d', price: 250.00, label: '1 Year' }
            ]
        }));

        return NextResponse.json({ numbers: travelFriendlyNumbers });
    } catch (error) {
        console.error('Travel Search Error:', error);
        return NextResponse.json(
            { message: 'Failed to fetch travel numbers' },
            { status: 500 }
        );
    }
}
