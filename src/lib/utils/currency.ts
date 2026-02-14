export const CURRENCY_MAP: Record<string, { code: string; symbol: string }> = {
    // North America
    US: { code: 'USD', symbol: '$' },
    CA: { code: 'CAD', symbol: 'CA$' },
    MX: { code: 'MXN', symbol: 'MX$' },
    // Europe
    GB: { code: 'GBP', symbol: '£' },
    FR: { code: 'EUR', symbol: '€' },
    DE: { code: 'EUR', symbol: '€' },
    IT: { code: 'EUR', symbol: '€' },
    ES: { code: 'EUR', symbol: '€' },
    NL: { code: 'EUR', symbol: '€' },
    IE: { code: 'EUR', symbol: '€' },
    CH: { code: 'CHF', symbol: 'CHF' },
    // Asia
    JP: { code: 'JPY', symbol: '¥' },
    CN: { code: 'CNY', symbol: '元' },
    IN: { code: 'INR', symbol: '₹' },
    KR: { code: 'KRW', symbol: '₩' },
    SG: { code: 'SGD', symbol: 'S$' },
    HK: { code: 'HKD', symbol: 'HK$' },
    // Africa
    NG: { code: 'NGN', symbol: '₦' },
    ZA: { code: 'ZAR', symbol: 'R' },
    KE: { code: 'KES', symbol: 'KSh' },
    GH: { code: 'GHS', symbol: 'GH₵' },
    // Oceania
    AU: { code: 'AUD', symbol: 'A$' },
    NZ: { code: 'NZD', symbol: 'NZ$' },
    // South America
    BR: { code: 'BRL', symbol: 'R$' },
    AR: { code: 'ARS', symbol: 'AR$' },
};

export const DEFAULT_CURRENCY = { code: 'USD', symbol: '$' };

export function getCurrencyForCountry(countryCode: string) {
    return CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;
}

export function formatPrice(amount: number, currencyCode: string = 'USD', symbol: string = '$') {
    return `${symbol}${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
