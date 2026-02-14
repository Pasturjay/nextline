"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Copy, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SdkCardProps {
    language: string;
    icon: React.ReactNode;
    version: string;
    installCmd: string;
    githubUrl: string;
}

export function SdkCard({ language, icon, version, installCmd, githubUrl }: SdkCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(installCmd);
            setCopied(true);
            toast.success("Command copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy command");
        }
    };

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center font-bold text-xs">
                        {icon}
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        v{version}
                    </div>
                </div>
                <CardTitle className="mt-4">{language}</CardTitle>
                <CardDescription>Server-side SDK</CardDescription>
            </CardHeader>
            <CardContent className="pb-3 flex-grow">
                <div
                    className="group relative bg-slate-950 text-slate-50 p-3 rounded text-xs font-mono overflow-x-auto cursor-pointer flex items-center justify-between hover:ring-2 hover:ring-primary/50 transition-all"
                    onClick={handleCopy}
                    role="button"
                    title="Click to copy"
                >
                    <span className="mr-8">{installCmd}</span>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-slate-400" />}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full gap-2">
                    <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" /> View on GitHub
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
