"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { COUNTRIES } from "@/lib/constants/countries";

interface VirtualNumber {
    phoneNumber: string;
    country: string;
    type: string;
    region?: string;
    price?: number;
    setupCost?: number;
    billingType?: "monthly" | "one-time";
}

interface NumberSearchInterfaceProps {
    retainNumber?: string;
}

export default function NumberSearchInterface({ retainNumber }: NumberSearchInterfaceProps = {}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<VirtualNumber[]>([]);

    // Search Filters
    const [country, setCountry] = useState("US");
    const [type, setType] = useState("local");
    const [areaCode, setAreaCode] = useState("");
    const [usageType, setUsageType] = useState<"monthly" | "one-time">("monthly");

    const handleSearch = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                country,
                type,
                usageType, // Pass usage type to API
                ...(areaCode && { areaCode })
            });

            const res = await fetch(`/api/numbers/search?${queryParams}`);
            if (!res.ok) throw new Error("Failed to fetch numbers");

            const data = await res.json();

            const mappedNumbers = (data.numbers || data).map((num: any) => ({
                phoneNumber: num.phoneNumber || num.number,
                country: num.country || country,
                type: num.type || type,
                region: num.region || num.city || "Unknown",
                price: usageType === 'one-time' ? ((num.monthlyPrice || num.price || 5.00) * 1.5) : (num.monthlyPrice || num.price || 5.00), // Higher price for one-time
                setupCost: usageType === 'one-time' ? 0 : (num.setupPrice || 1.00), // No setup for one-time
                billingType: usageType
            }));

            setResults(mappedNumbers);
        } catch (error) {
            toast.error("Error searching for numbers");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = (number: VirtualNumber) => {
        const params = new URLSearchParams({
            phoneNumber: number.phoneNumber,
            country: number.country,
            price: number.price?.toString() || "5.00",
            setup: number.setupCost?.toString() || "0",
            billing: number.billingType || "monthly"
        });
        router.push(`/dashboard/checkout?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Find Your Number</CardTitle>
                        <Tabs value={usageType} onValueChange={(v) => setUsageType(v as "monthly" | "one-time")}>
                            <TabsList>
                                <TabsTrigger value="monthly">Monthly Subscription</TabsTrigger>
                                <TabsTrigger value="one-time">One-Time Use</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger>
                            <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            {COUNTRIES.filter(c => !["US", "GB", "CA"].includes(c.value)).map((c) => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="local">Local</SelectItem>
                            <SelectItem value="tollfree">Toll-Free</SelectItem>
                            <SelectItem value="mobile">Mobile</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Area Code (Optional)"
                        value={areaCode}
                        onChange={(e) => setAreaCode(e.target.value)}
                    />

                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        Search
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((num) => (
                    <Card key={num.phoneNumber} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-primary/5 pb-4">
                            <CardTitle className="text-lg flex justify-between items-center">
                                {num.phoneNumber}
                                <Badge variant="secondary">{num.country}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Location:</span>
                                <span className="font-medium">{num.region}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Type:</span>
                                <span className="capitalize">{num.type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{num.billingType === 'one-time' ? 'Price (30 Days):' : 'Monthly:'}</span>
                                <span className="font-bold text-primary">${num.price?.toFixed(2)}</span>
                            </div>
                            {num.billingType === 'monthly' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Setup:</span>
                                    <span className="font-medium">${num.setupCost?.toFixed(2)}</span>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleBuy(num)}>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Buy Number
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {results.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No numbers found. Try adjusting your search criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
