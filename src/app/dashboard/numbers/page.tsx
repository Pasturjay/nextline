import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Settings, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { NumberActions } from "@/components/dashboard/numbers/number-actions";

export const dynamic = 'force-dynamic';

export default async function VirtualNumbersPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const numbers = await prisma.virtualNumber.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Virtual Numbers</h2>
                    <p className="text-muted-foreground">
                        Manage your active phone numbers and configurations.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/buy-number">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Buy Number
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Numbers</CardTitle>
                    <CardDescription>
                        A list of all numbers currently provisioned to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {numbers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed">
                            <div className="rounded-full bg-primary/10 p-4 mb-4">
                                <Phone className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold">No numbers found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mb-4">
                                You haven&apos;t purchased any virtual numbers yet. Get started by acquiring your first number.
                            </p>
                            <Link href="/dashboard/buy-number">
                                <Button>Buy a Number</Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Capabilities</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {numbers.map((number) => {
                                    const capabilities = ["voice", "sms"]; // Default capabilities for now
                                    return (
                                        <TableRow key={number.id}>
                                            <TableCell className="font-medium">{number.phoneNumber}</TableCell>
                                            <TableCell>{number.country}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {capabilities.includes("voice") && (
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">Voice</Badge>
                                                    )}
                                                    {capabilities.includes("sms") && (
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">SMS</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={number.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                                    {number.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <NumberActions
                                                    numberId={number.id}
                                                    phoneNumber={number.phoneNumber}
                                                    status={number.status}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
