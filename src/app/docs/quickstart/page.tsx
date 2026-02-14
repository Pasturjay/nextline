import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuickstartPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1>Quickstart Guide</h1>
            <p className="lead">
                This guide will get you up and running with NexaLine in minutes. We'll show you how to sign up, get your API keys, and send your first SMS.
            </p>

            <h2>Step 1: Create an Account</h2>
            <p>
                First, you need to <Link href="/auth/register">sign up for a NexaLine account</Link>. It's free to start, and you'll get a small credit to test the API.
            </p>

            <h2>Step 2: Get your API Key</h2>
            <p>
                Once logged in, navigate to the <strong>Developer</strong> section of the dashboard. Here you can generate your first API Key.
            </p>

            <h2>Step 3: Send an SMS</h2>
            <p>
                Use the following <code>curl</code> command to send a message. Replace the API key and phone numbers with your own.
            </p>
            <pre><code>{`curl -X POST https://api.nexaline.com/v1/sms/send \\
                -H "Authorization: Bearer nk_test_12345678" \\
                -H "Content-Type: application/json" \\
                -d '{
                    "to": "+15550000000",
                    "message": "Hello from NexaLine!"
  }'`}</code></pre>

            <p>
                You should receive a <code>200 OK</code> response with a message ID. Congratulations! You've sent your first message.
            </p>
        </div>
    );
}
