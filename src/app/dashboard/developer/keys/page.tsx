"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Trash2, Copy } from "lucide-react"

interface ApiKey {
    id: string
    name: string
    keyPrefix: string
    status: string
    createdAt: string
    lastUsedAt: string | null
}

export default function ApiKeysPage() {
    const [keys, setKeys] = React.useState<ApiKey[]>([])
    const [loading, setLoading] = React.useState(true)
    const [newKeyName, setNewKeyName] = React.useState("")
    const [generatedKey, setGeneratedKey] = React.useState<string | null>(null)
    const [isCreating, setIsCreating] = React.useState(false)

    const fetchKeys = async () => {
        try {
            const res = await fetch("/api/v1/keys")
            if (res.ok) {
                const data = await res.json()
                setKeys(data.keys)
            }
        } catch (error) {
            console.error("Failed to fetch keys", error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchKeys()
    }, [])

    const createKey = async () => {
        if (!newKeyName) return
        setIsCreating(true)
        try {
            const res = await fetch("/api/v1/keys", {
                method: "POST",
                body: JSON.stringify({ name: newKeyName }),
                headers: { "Content-Type": "application/json" }
            })

            if (res.ok) {
                const data = await res.json()
                setGeneratedKey(data.apiKey) // The full key
                fetchKeys()
                toast.success("API Key created successfully")
            } else {
                toast.error("Failed to create key")
            }
        } catch (error) {
            toast.error("Error creating key")
        } finally {
            setIsCreating(false)
        }
    }

    const revokeKey = async (id: string) => {
        if (!confirm("Are you sure you want to revoke this key? This action cannot be undone.")) return

        try {
            const res = await fetch(`/api/v1/keys/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Key revoked")
                fetchKeys()
            } else {
                toast.error("Failed to revoke key")
            }
        } catch (error) {
            toast.error("Error revoking key")
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="space-y-6 p-10 pb-16">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">API Keys</h2>
                    <p className="text-muted-foreground">
                        Manage your API keys for accessing the NexaLine API.
                    </p>
                </div>
                <Dialog onOpenChange={(open) => { if (!open) setGeneratedKey(null) }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Generate New Key
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generate API Key</DialogTitle>
                            <DialogDescription>
                                Create a new API key for your application.
                            </DialogDescription>
                        </DialogHeader>

                        {!generatedKey ? (
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Key Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Production App"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4 py-4">
                                <div className="p-4 bg-muted rounded-md break-all relative">
                                    <p className="font-mono text-sm">{generatedKey}</p>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={() => copyToClipboard(generatedKey)}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-yellow-600 font-medium">
                                    Important: Copy this key now. You won't be able to see it again!
                                </p>
                            </div>
                        )}

                        <DialogFooter>
                            {!generatedKey ? (
                                <Button onClick={createKey} disabled={isCreating || !newKeyName}>
                                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate
                                </Button>
                            ) : (
                                <Button onClick={() => document.getElementById("close-dialog")?.click()}>
                                    Done
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Key Prefix</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Used</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : keys.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    No API keys found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            keys.map((key) => (
                                <TableRow key={key.id}>
                                    <TableCell className="font-medium">{key.name}</TableCell>
                                    <TableCell className="font-mono">{key.keyPrefix}...</TableCell>
                                    <TableCell>
                                        <Badge variant={key.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                            {key.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={key.status !== 'ACTIVE'}
                                            onClick={() => revokeKey(key.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div >
    )
}
