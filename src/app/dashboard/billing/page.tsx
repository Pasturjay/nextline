"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, CreditCard, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

interface BillingData {
    accountType: string;
    customerId: string | null;
    subscriptions: any[];
    invoices: any[];
}

export default function BillingPage() {
    const [data, setData] = useState<BillingData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchBilling = async () => {
            try {
                const res = await fetch("/api/billing");
                if (res.ok) {
                    const json = await res.json();
                    if (isMounted) {
                        setData(json);
                    }
                }
            } catch (error) {
                console.error(error);
                if (isMounted) {
                    toast.error("Failed to load billing info");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchBilling();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleManageBilling = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/billing/portal", { method: "POST" });
            if (res.ok) {
                const { url, isDemo } = await res.json();
                if (isDemo) {
                    toast.info("Demo mode: Stripe portal requires a real API key. Using placeholder for now.");
                } else {
                    window.location.href = url;
                }
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to open billing portal");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to open billing portal");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = (invoiceId: string) => {
        toast.info("Invoice download coming soon. For now, please use the Stripe portal.");
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!data) return <div>No billing data available</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
                <p className="text-muted-foreground">Manage your billing information and view invoices.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>Your current account tier.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize mb-2">{data.accountType?.toLowerCase() || 'Individual'}</div>
                        <Badge variant="outline">Active</Badge>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Account ID: {data.customerId || 'N/A'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Manage your payment details.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-[120px]">
                        <div className="flex items-center space-x-4">
                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Stripe Secure Payment</p>
                                <p className="text-xs text-muted-foreground">Managed via Stripe Customer Portal</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-auto" onClick={handleManageBilling}>
                            Manage Billing <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Subscriptions</CardTitle>
                    <CardDescription>Recurring billing items.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Renewal Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.subscriptions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                        No active subscriptions.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.subscriptions.map((sub) => (
                                    <TableRow key={sub.id}>
                                        <TableCell className="font-medium">
                                            {sub.numbers && sub.numbers[0] ? `Virtual Number: ${sub.numbers[0].phoneNumber}` : 'Subscription'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(sub.currentPeriodEnd), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${Number(sub.amount).toFixed(2)} / {sub.billingInterval.toLowerCase()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Invoice History</CardTitle>
                    <CardDescription>Download past invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                                        No invoices found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.invoices.map((inv) => (
                                    <TableRow key={inv.id}>
                                        <TableCell className="font-mono text-xs">{inv.id.substring(0, 8)}...</TableCell>
                                        <TableCell>{format(new Date(inv.createdAt), "MMM d, yyyy")}</TableCell>
                                        <TableCell>${Number(inv.amount).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={inv.status === 'PAID' ? 'default' : 'secondary'}>
                                                {inv.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleDownloadInvoice(inv.id)}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
