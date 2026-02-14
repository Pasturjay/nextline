"use client";

import { useState, useEffect } from "react";
import { Copy, Plus, Trash, Eye, EyeOff, Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

interface ApiKey {
    id: string;
    name: string;
    keyPrefix: string;
    createdAt: string;
    lastUsedAt?: string;
}

export default function ApiKeyManager() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState("");
    const [creating, setCreating] = useState(false);
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [showCreatedKey, setShowCreatedKey] = useState(false);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const res = await fetch("/api/api-keys");
            if (res.ok) {
                const data = await res.json();
                setKeys(data);
            }
        } catch (error) {
            toast.error("Failed to fetch API keys");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) return;
        setCreating(true);
        try {
            const res = await fetch("/api/api-keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newKeyName }),
            });

            if (!res.ok) throw new Error("Failed to create key");

            const data = await res.json();
            setCreatedKey(data.secretKey);
            setShowCreatedKey(true);
            setNewKeyName("");
            fetchKeys();
            toast.success("API Key created successfully");
        } catch (error) {
            toast.error("Failed to create API key");
        } finally {
            setCreating(false);
        }
    };

    const handleRevokeKey = async (id: string) => {
        if (!confirm("Are you sure you want to revoke this key? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/api-keys?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to revoke key");

            toast.success("API Key revoked");
            fetchKeys();
        } catch (error) {
            toast.error("Failed to revoke API key");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">API Keys</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your API keys for accessing the NexaLine API.
                    </p>
                </div>
                <Dialog open={showCreatedKey} onOpenChange={setShowCreatedKey}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setShowCreatedKey(false)}>
                            <Plus className="mr-2 h-4 w-4" /> Create New Key
                        </Button>
                    </DialogTrigger>
                    {createdKey ? (
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>API Key Created</DialogTitle>
                                <DialogDescription>
                                    Please copy your secret key now. You won&apos;t be able to see it again!
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 bg-muted p-4 rounded-md">
                                <code className="flex-1 break-all text-sm font-mono">{createdKey}</code>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(createdKey)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => { setCreatedKey(null); setShowCreatedKey(false); }}>Done</Button>
                            </DialogFooter>
                        </DialogContent>
                    ) : (
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New API Key</DialogTitle>
                                <DialogDescription>
                                    Enter a name for this key to identify it later.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input
                                    placeholder="e.g. Production Server"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateKey} disabled={creating || !newKeyName}>
                                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Key
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    )}
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Key Prefix</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Last Used</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : keys.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No active API keys found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                keys.map((key) => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-medium">{key.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{key.keyPrefix}</TableCell>
                                        <TableCell>{format(new Date(key.createdAt), "MMM d, yyyy")}</TableCell>
                                        <TableCell>
                                            {key.lastUsedAt ? format(new Date(key.lastUsedAt), "MMM d, yyyy") : "Never"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleRevokeKey(key.id)} className="text-destructive hover:text-destructive/90">
                                                <Trash className="h-4 w-4" />
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
