import { CodeBlock } from "@/components/ui/code-block";

export default function AuthDocsPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1>Authentication</h1>
            <p className="lead">
                NexaLine uses API keys to allow access to the API. You can register a new NexaLine API key at our <a href="/dashboard/developer/keys">API portal</a>.
            </p>
            <p>
                NexaLine expects for the API key to be included in all API requests to the server in a header that looks like the following:
            </p>
            <CodeBlock code="Authorization: Bearer YOUR_API_KEY" />
            <div className="not-prose bg-amber-50 border-l-4 border-amber-500 p-4 my-4 dark:bg-amber-950/20">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                    <strong>Note:</strong> You must replace <code>YOUR_API_KEY</code> with your personal API key.
                </p>
            </div>
        </div>
    );
}
