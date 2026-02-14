"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { detectLocation } from '@/lib/utils/location';
import { getCurrencyForCountry, DEFAULT_CURRENCY, formatPrice } from '@/lib/utils/currency';

interface CurrencyContextType {
    currency: string;
    symbol: string;
    rate: number;
    convert: (usdAmount: number) => number;
    format: (amount: number, isUsd?: boolean) => string;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
    currency: DEFAULT_CURRENCY.code,
    symbol: DEFAULT_CURRENCY.symbol,
    rate: 1,
    convert: (amount) => amount,
    format: (amount) => formatPrice(amount, DEFAULT_CURRENCY.code, DEFAULT_CURRENCY.symbol),
    isLoading: true,
});

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY.code);
    const [symbol, setSymbol] = useState(DEFAULT_CURRENCY.symbol);
    const [rate, setRate] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function initCurrency() {
            try {
                // 1. Detect Location
                const location = await detectLocation();
                const userCurrency = getCurrencyForCountry(location?.countryCode || 'US');

                setCurrency(userCurrency.code);
                setSymbol(userCurrency.symbol);

                // 2. Fetch Exchange Rate if not USD
                if (userCurrency.code !== 'USD') {
                    // Try to get from cache first
                    const cached = localStorage.getItem(`rate_${userCurrency.code}`);
                    const cacheTime = localStorage.getItem(`rate_time_${userCurrency.code}`);

                    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 24 * 60 * 60 * 1000) {
                        setRate(parseFloat(cached));
                    } else {
                        const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${userCurrency.code}`);
                        const data = await res.json();
                        if (data.rates && data.rates[userCurrency.code]) {
                            const newRate = data.rates[userCurrency.code];
                            setRate(newRate);
                            localStorage.setItem(`rate_${userCurrency.code}`, newRate.toString());
                            localStorage.setItem(`rate_time_${userCurrency.code}`, Date.now().toString());
                        }
                    }
                }
            } catch (error) {
                console.error('Currency initialization failed:', error);
            } finally {
                setIsLoading(false);
            }
        }

        initCurrency();
    }, []);

    const convert = (usdAmount: number) => {
        return usdAmount * rate;
    };

    const format = (amount: number, isUsd: boolean = false) => {
        if (isUsd) return formatPrice(amount, 'USD', '$');
        const convertedAmount = convert(amount);
        return formatPrice(convertedAmount, currency, symbol);
    };

    return (
        <CurrencyContext.Provider value={{ currency, symbol, rate, convert, format, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
}
