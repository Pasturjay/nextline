"use client"

import * as React from "react"
import { format, addDays } from "date-fns"
import { Calendar as CalendarIcon, Search, MapPin, Globe, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import { COUNTRIES } from "@/lib/constants/countries"

const DURATIONS = [
    { label: "7 Days", value: "7", priceMultiplier: 1 },
    { label: "30 Days", value: "30", priceMultiplier: 3 },
    { label: "60 Days", value: "60", priceMultiplier: 5.5 },
    { label: "90 Days", value: "90", priceMultiplier: 8 },
    { label: "12 Months", value: "365", priceMultiplier: 25 },
]

export default function TravelSearchPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [duration, setDuration] = React.useState("7")
    const [country, setCountry] = React.useState("US")
    const [results, setResults] = React.useState<any[]>([])
    const [activeRentals, setActiveRentals] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        // Fetch active rentals
        fetch('/api/travel/rentals')
            .then(res => res.json())
            .then(data => setActiveRentals(data.rentals || []))
            .catch(err => console.error(err));
    }, []);

    const handleSearch = async () => {
        setLoading(true)

        try {
            const res = await fetch(`/api/travel/search?country=${country}`);
            if (!res.ok) throw new Error("Failed to fetch numbers");

            const data = await res.json();

            // Map keys if needed, assuming API structure matches what we expect or we adapt here
            // The API returns { numbers: [...] }
            // API numbers have 'packages' array. We need to filter/find the package matching selected duration
            // or just display the number and let user click 'Book' which takes them to checkout
            // For this UI, we want to show the price for the *selected* duration.

            const mappedResults = data.numbers.map((num: any) => {
                // Find the price package for the selected duration (or closest match)
                // The API returns '7d', '14d', '30d'. our UI has '7', '30'.
                const durationKey = `${duration}d`;
                const pkg = num.packages.find((p: any) => p.duration === durationKey) || num.packages[0];

                return {
                    id: num.phoneNumber,
                    phoneNumber: num.phoneNumber,
                    country: num.country,
                    countryCode: num.countryCode || num.country, // Fallback if needed but API should provide it
                    region: num.region,
                    type: num.type,
                    price: pkg ? pkg.price : 0,
                    capabilities: ["VOICE", "SMS"], // Assumed for travel numbers
                };
            });

            setResults(mappedResults);
        } catch (error) {
            console.error(error);
            // setResults([]) // Optional: clear results on error
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="space-y-6 p-10 pb-16">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Travel Number Rental</h2>
                <p className="text-muted-foreground">
                    Rent a local number for your trip. No SIM card needed.
                </p>
            </div>

            {/* Active Rentals Section */}
            {activeRentals.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">My Active Rentals</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeRentals.map((rental) => (
                            <Card key={rental.id} className="bg-primary/5 border-primary/20">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{rental.phoneNumber}</CardTitle>
                                        <div className="px-2 py-1 rounded bg-green-500/10 text-green-600 text-xs font-semibold uppercase">
                                            Active
                                        </div>
                                    </div>
                                    <CardDescription>{rental.country}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    <div className="flex justify-between py-1">
                                        <span className="text-muted-foreground">Expires</span>
                                        <span className="font-medium">{format(new Date(rental.expiresAt), "MMM d, yyyy")}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-medium">{rental.duration}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-end bg-muted/40 p-6 rounded-lg border">
                <div className="grid w-full items-center gap-1.5">
                    <Label>Destination</Label>
                    <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                            {COUNTRIES.map((c) => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label>Start Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label>Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            {DURATIONS.map((d) => (
                                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto">
                    {loading ? <Globe className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Search Numbers
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.map((item) => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl font-mono">{item.phoneNumber}</CardTitle>
                            <CardDescription>{item.country} • {DURATIONS.find(d => d.value === duration)?.label} Rental</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>Voice & SMS enabled</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>Valid until {date ? format(addDays(date, parseInt(duration)), "MMM d, yyyy") : '...'}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center border-t p-6 bg-muted/20">
                            <div>
                                <p className="text-2xl font-bold">${item.price}</p>
                                <p className="text-xs text-muted-foreground">Total for {duration} days</p>
                            </div>
                            <Button asChild>
                                <Link href={`/dashboard/checkout?phoneNumber=${encodeURIComponent(item.phoneNumber)}&country=${encodeURIComponent(item.countryCode)}&price=${item.price}&type=RENTAL&duration=${duration}`}>
                                    Book Now
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                {!loading && results.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Select a destination and dates to find numbers</p>
                    </div>
                )}
            </div>
        </div>
    )
}
