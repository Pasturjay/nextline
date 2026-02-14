"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface OpenApiSpec {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    paths: Record<string, Record<string, any>>;
    components: {
        schemas: Record<string, any>;
    };
}

export default function ApiReferencePage() {
    const [spec, setSpec] = useState<OpenApiSpec | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/openapi.json")
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Failed to fetch spec: ${res.status} ${res.statusText} - ${text.substring(0, 100)}`);
                }
                return res.json();
            })
            .then((data) => {
                setSpec(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load OpenAPI spec", err);
                setError(err.message || "Unknown error occurred");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }

    if (error) {
        return (
            <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Failed to load API Reference</h3>
                <p className="text-sm text-red-600 dark:text-red-400 font-mono">{error}</p>
                <p className="text-sm text-muted-foreground mt-4">
                    Please ensure <code>public/openapi.json</code> exists and is accessible.
                </p>
            </div>
        );
    }

    if (!spec) {
        return <div>Failed to load API Reference (No Spec).</div>;
    }

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{spec.info.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Badge variant="outline">v{spec.info.version}</Badge>
                    <span>{spec.info.description}</span>
                </div>
            </div>

            <div className="space-y-12">
                {Object.entries(spec.paths).map(([path, methods]) => (
                    <div key={path} className="space-y-6">
                        {Object.entries(methods).map(([method, operation]: [string, any]) => (
                            <Card key={`${path}-${method}`} className="overflow-hidden border-l-4" style={{ borderLeftColor: getMethodColor(method) }}>
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex items-center gap-4">
                                        <Badge className={`${getMethodBadgeClass(method)} uppercase`}>{method}</Badge>
                                        <code className="text-lg font-mono">{path}</code>
                                    </div>
                                    <CardTitle className="mt-4 text-xl">{operation.summary}</CardTitle>
                                    <CardDescription>{operation.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <Tabs defaultValue="params">
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="params">Parameters / Body</TabsTrigger>
                                            <TabsTrigger value="responses">Responses</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="params" className="space-y-4">
                                            {operation.requestBody && (
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-semibold">Request Body</h4>
                                                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-sm overflow-x-auto">
                                                        {JSON.stringify(operation.requestBody.content["application/json"].schema, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                            {!operation.requestBody && <p className="text-sm text-muted-foreground">No request parameters.</p>}
                                        </TabsContent>

                                        <TabsContent value="responses" className="space-y-4">
                                            {Object.entries(operation.responses).map(([code, response]: [string, any]) => (
                                                <div key={code} className="border rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant={code.startsWith("2") ? "default" : "destructive"}>{code}</Badge>
                                                        <span className="text-sm font-medium">{response.description}</span>
                                                    </div>
                                                    {response.content && response.content["application/json"] && (
                                                        <pre className="bg-muted p-2 rounded text-xs mt-2 overflow-x-auto">
                                                            {JSON.stringify(response.content["application/json"].schema, null, 2)}
                                                        </pre>
                                                    )}
                                                </div>
                                            ))}
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function getMethodColor(method: string) {
    switch (method.toLowerCase()) {
        case "get": return "#3b82f6"; // blue-500
        case "post": return "#22c55e"; // green-500
        case "put": return "#f59e0b"; // amber-500
        case "delete": return "#ef4444"; // red-500
        default: return "#64748b"; // slate-500
    }
}

function getMethodBadgeClass(method: string) {
    switch (method.toLowerCase()) {
        case "get": return "bg-blue-500 hover:bg-blue-600";
        case "post": return "bg-green-500 hover:bg-green-600";
        case "put": return "bg-amber-500 hover:bg-amber-600";
        case "delete": return "bg-red-500 hover:bg-red-600";
        default: return "bg-slate-500";
    }
}
