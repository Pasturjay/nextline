export interface LocationData {
    countryCode: string;
    countryName: string;
    currency: string; // Optional: Some APIs provide it directly
}

export async function detectLocation(): Promise<LocationData | null> {
    try {
        // We use ip-api.com for free, simple IP-based geolocation.
        // For production, consider using a paid service with more reliable uptime or Vercel's x-vercel-ip-country header.
        const response = await fetch('http://ip-api.com/json/');
        if (!response.ok) throw new Error('Failed to fetch location');

        const data = await response.json();

        return {
            countryCode: data.countryCode,
            countryName: data.country,
            currency: '', // Will be mapped via CURRENCY_MAP
        };
    } catch (error) {
        console.error('Location detection failed:', error);
        return null;
    }
}
