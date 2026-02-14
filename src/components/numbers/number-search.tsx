"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Filter, ShoppingCart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface VirtualNumber {
    phoneNumber: string
    country: string
    numberType: string
    areaCode?: string
    monthlyPrice: number
    setupFee: number
    capabilities: {
        voice: boolean
        sms: boolean
        mms: boolean
    }
}

export function NumberSearchInterface() {
    const [loading, setLoading] = React.useState(false)
    const [results, setResults] = React.useState<VirtualNumber[]>([])
    const [filters, setFilters] = React.useState({
        country: "US",
        type: "local",
        areaCode: "",
        prefix: ""
    })

    // Mock search for development if API is down
    const searchNumbers = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams(filters)
            const res = await fetch(`/api/numbers/search?${params}`)

            if (!res.ok) {
                // Fallback mock data
                await new Promise(r => setTimeout(r, 1000))
                setResults([
                    {
                        phoneNumber: "+14155551234",
                        country: "US",
                        numberType: "local",
                        areaCode: "415",
                        monthlyPrice: 5.00,
                        setupFee: 1.00,
                        capabilities: { voice: true, sms: true, mms: true }
                    },
                    {
                        phoneNumber: "+14155555678",
                        country: "US",
                        numberType: "local",
                        areaCode: "415",
                        monthlyPrice: 5.00,
                        setupFee: 1.00,
                        capabilities: { voice: true, sms: true, mms: false }
                    },
                    {
                        phoneNumber: "+12125559999",
                        country: "US",
                        numberType: "local",
                        areaCode: "212",
                        monthlyPrice: 6.00,
                        setupFee: 1.00,
                        capabilities: { voice: true, sms: true, mms: true }
                    }
                ])
                toast.info("Using mock data (API unavailable)")
            } else {
                const data = await res.json()
                setResults(data.numbers || [])
            }
        } catch (err) {
            toast.error("Failed to search numbers")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Select
                        value={filters.country}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, country: val }))}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="US">United States (US)</SelectItem>
                            <SelectItem value="GB">United Kingdom (GB)</SelectItem>
                            <SelectItem value="CA">Canada (CA)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select
                        value={filters.type}
                        onValueChange={(val) => setFilters(prev => ({ ...prev, type: val }))}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Number Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="local">Local</SelectItem>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="toll_free">Toll Free</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Area Code</label>
                    <Input
                        placeholder="e.g. 415"
                        className="w-[120px]"
                        value={filters.areaCode}
                        onChange={(e) => setFilters(prev => ({ ...prev, areaCode: e.target.value }))}
                    />
                </div>

                <Button onClick={searchNumbers} disabled={loading} className="w-full md:w-auto">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Search
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((number) => (
                    <Card key={number.phoneNumber}>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-center">
                                <span>{formatPhoneNumber(number.phoneNumber)}</span>
                                <Badge variant={number.capabilities.sms ? "default" : "secondary"}>
                                    {number.capabilities.sms ? "SMS" : "Voice Only"}
                                </Badge>
                            </CardTitle>
                            <CardDescription>{number.country} • {number.numberType.toUpperCase()}</CardDescription>
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-muted-foreground">Monthly</span>
                                <span className="font-bold">${number.monthlyPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Setup</span>
                                <span className="font-bold">${number.setupFee.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild>
                                <Link href={`/dashboard/checkout?number=${encodeURIComponent(number.phoneNumber)}&price=${number.monthlyPrice}`}>
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Buy Now
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                {!loading && results.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No numbers found. Try adjusting your search filters.
                    </div>
                )}
            </div>
        </div>
    )
}

function formatPhoneNumber(phone: string) {
    // Basic formatting for demo
    if (phone.length === 12 && phone.startsWith("+1")) {
        return `+1 (${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8)}`
    }
    return phone
}
