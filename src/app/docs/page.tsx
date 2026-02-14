import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1>Introduction to NexaLine API</h1>
            <p className="lead">
                Welcome to the NexaLine API Documentation. Our platform enables you to integrate global communication capabilities—SMS, Virtual Numbers, and Authentication—for any use case, whether you're building applications, managing business communications, or verifying users.
            </p>

            <div className="not-prose grid gap-6 md:grid-cols-2 my-8">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-2">Quickstart Guide</h3>
                    <p className="text-muted-foreground text-sm mb-4">Send your first message in less than 5 minutes using our simple REST API.</p>
                    <Link href="/docs/quickstart">
                        <Button variant="outline" size="sm" className="w-full">Start Building</Button>
                    </Link>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-2">API Reference</h3>
                    <p className="text-muted-foreground text-sm mb-4">Detailed endpoint documentation, request/response schemas, and example code.</p>
                    <Link href="/docs/api">
                        <Button variant="outline" size="sm" className="w-full">View Reference</Button>
                    </Link>
                </div>
            </div>

            <h2>Base URL</h2>
            <p>All API requests should be made to the following base URL:</p>
            <pre><code>https://api.nexaline.com/v1</code></pre>

            <h2>Authentication</h2>
            <p>
                The NexaLine API uses API keys to authenticate requests. You can view and manage your API keys in the <Link href="/dashboard/developer/keys">API Dashboard</Link>.
            </p>
            <p>
                Authentication to the API is performed via HTTP Basic Auth. Provide your API Key as the basic auth username. You do not need to provide a password.
            </p>
            <pre><code>curl https://api.nexaline.com/v1/messages \
                -u "YOUR_API_KEY:"</code></pre>

            <h2>Response Format</h2>
            <p>
                Our API returns responses in <strong>JSON</strong> format. Successful responses will have a <code>2xx</code> HTTP status code. Client errors will have a <code>4xx</code> code, and server errors will have a <code>5xx</code> code.
            </p>
        </div>
    );
}
