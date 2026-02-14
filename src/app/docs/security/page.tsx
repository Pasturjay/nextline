import { Shield, Lock, Key, FileCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4">Enterprise Security</h1>
                <p className="text-xl text-muted-foreground">
                    SOC 2 Type II certified infrastructure with end-to-end encryption
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-12">
                <Card className="glass-panel">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                                <Shield className="h-6 w-6" />
                            </div>
                            <CardTitle>SOC 2 Type II Certified</CardTitle>
                        </div>
                        <CardDescription>
                            Independently verified security controls and processes
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="glass-panel">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                                <FileCheck className="h-6 w-6" />
                            </div>
                            <CardTitle>GDPR Compliant</CardTitle>
                        </div>
                        <CardDescription>
                            Full compliance with European data protection regulations
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="glass-panel">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                                <Lock className="h-6 w-6" />
                            </div>
                            <CardTitle>HIPAA Ready</CardTitle>
                        </div>
                        <CardDescription>
                            Healthcare-grade security for sensitive communications
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="glass-panel">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
                                <Key className="h-6 w-6" />
                            </div>
                            <CardTitle>End-to-End Encryption</CardTitle>
                        </div>
                        <CardDescription>
                            AES-256 encryption for data at rest and in transit
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Security Features</CardTitle>
                    <CardDescription>Comprehensive security measures across all services</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 rounded bg-primary/10 text-primary">
                                <Shield className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Dedicated Tenant Isolation</h4>
                                <p className="text-sm text-muted-foreground">
                                    Enterprise accounts run in isolated environments with dedicated resources
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 rounded bg-primary/10 text-primary">
                                <Lock className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">API Authentication</h4>
                                <p className="text-sm text-muted-foreground">
                                    OAuth 2.0, API keys, and JWT tokens for secure access control
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 rounded bg-primary/10 text-primary">
                                <FileCheck className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Audit Logging</h4>
                                <p className="text-sm text-muted-foreground">
                                    Comprehensive logs of all API requests and administrative actions
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 rounded bg-primary/10 text-primary">
                                <Key className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Role-Based Access Control</h4>
                                <p className="text-sm text-muted-foreground">
                                    Granular permissions and team management for enterprise accounts
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
