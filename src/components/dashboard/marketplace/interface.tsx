"use client";

import { useState, useEffect } from "react";
import { Loader2, Star, Tag, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface MarketplaceListing {
    id: string;
    pricePerDay: string; // Decimal comes as string from API usually
    minRentalDays: number;
    reputationScore: number;
    number: {
        phoneNumber: string;
        country: string;
        numberType: string;
    }
}

export default function MarketplaceInterface() {
    const [listings, setListings] = useState<MarketplaceListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCountry, setFilterCountry] = useState("ALL");

    useEffect(() => {
        fetchListings();
    }, [filterCountry]);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const query = filterCountry !== "ALL" ? `?country=${filterCountry}` : "";
            const res = await fetch(`/api/market/listings${query}`);
            if (res.ok) {
                const data = await res.json();
                setListings(data);
            }
        } catch (error) {
            toast.error("Failed to load listings");
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (listingId: string) => {
        // For demo purposes, we're just creating a pending booking for 7 days
        // In production, this would open a modal to select dates and payment
        try {
            const res = await fetch("/api/market/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listingId,
                    startDate: new Date().toISOString(),
                    durationDays: 7,
                })
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }

            toast.success("Booking request sent! Check your email.");
        } catch (error: any) {
            toast.error(error.message || "Failed to book");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filterCountry} onValueChange={setFilterCountry}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Countries</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                    {listings.length} listings found
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : listings.map((listing) => (
                    <Card key={listing.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                        <CardHeader className="bg-primary/5 pb-4">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="bg-background">{listing.number.country}</Badge>
                                <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                                    <Star className="h-3 w-3 mr-1 fill-yellow-800" />
                                    {listing.reputationScore.toFixed(1)}
                                </div>
                            </div>
                            <CardTitle className="mt-2 text-xl tracking-tight">
                                {listing.number.phoneNumber}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Daily Rate:</span>
                                <span className="font-bold text-lg">${Number(listing.pricePerDay).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Min Rental:</span>
                                <span>{listing.minRentalDays} days</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleBook(listing.id)}>
                                Book Now
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
