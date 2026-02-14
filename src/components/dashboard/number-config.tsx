"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Phone, Save } from "lucide-react";

interface VirtualNumberConfig {
    id: string;
    phoneNumber: string;
    forwardToNumber: string | null;
    forwardToSIP: string | null;
    voicemailEnabled: boolean;
    callRecording: boolean;
}

export default function NumberConfigDashboard({ numberId }: { numberId: string }) {
    const [config, setConfig] = useState<VirtualNumberConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchNumberDetails();
    }, [numberId]);

    const fetchNumberDetails = async () => {
        try {
            const res = await fetch(`/api/numbers/${numberId}`);
            if (!res.ok) throw new Error("Failed to fetch number details");
            const data = await res.json();
            setConfig(data);
        } catch (error) {
            toast.error("Error loading number configuration");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/numbers/${numberId}/config`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    forwardToNumber: config.forwardToNumber,
                    forwardToSIP: config.forwardToSIP,
                    voicemailEnabled: config.voicemailEnabled,
                    callRecording: config.callRecording,
                }),
            });

            if (!res.ok) throw new Error("Failed to update configuration");

            toast.success("Configuration updated successfully");
        } catch (error) {
            toast.error("Failed to update configuration");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div><Loader2 className="animate-spin" /> Loading...</div>;
    if (!config) return <div>Number not found</div>;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        {config.phoneNumber}
                    </CardTitle>
                    <CardDescription>
                        Manage call routing and features for this number
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="forward-to">Forward Calls To (Phone Number)</Label>
                        <Input
                            id="forward-to"
                            placeholder="+1234567890"
                            value={config.forwardToNumber || ""}
                            onChange={(e) => setConfig({ ...config, forwardToNumber: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="forward-sip">Forward Calls To (SIP URI)</Label>
                        <Input
                            id="forward-sip"
                            placeholder="sip:user@domain.com"
                            value={config.forwardToSIP || ""}
                            onChange={(e) => setConfig({ ...config, forwardToSIP: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                        <div className="space-y-1">
                            <Label htmlFor="voicemail">Voicemail</Label>
                            <div className="text-sm text-muted-foreground">
                                Enable voicemail when calls are not answered
                            </div>
                        </div>
                        <Switch
                            id="voicemail"
                            checked={config.voicemailEnabled}
                            onCheckedChange={(checked) => setConfig({ ...config, voicemailEnabled: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                        <div className="space-y-1">
                            <Label htmlFor="recording">Call Recording</Label>
                            <div className="text-sm text-muted-foreground">
                                Record all incoming calls
                            </div>
                        </div>
                        <Switch
                            id="recording"
                            checked={config.callRecording}
                            onCheckedChange={(checked) => setConfig({ ...config, callRecording: checked })}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
