export default function WebhooksDocsPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1>Webhooks</h1>
            <p className="lead">
                Webhooks allow your application to receive real-time notifications about events in NexaLine.
            </p>
            <h2>Supported Events</h2>
            <ul>
                <li><code>sms.received</code> - Triggered when a message is received.</li>
                <li><code>sms.delivered</code> - Triggered when a message delivery status updates.</li>
                <li><code>call.received</code> - Triggered when an incoming call is received.</li>
            </ul>
            <h2>Security</h2>
            <p>
                We include a <code>X-NexaLine-Signature</code> header in every webhook request. You should verify this signature to ensure the request came from us.
            </p>
        </div>
    );
}
