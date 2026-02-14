import { CodeBlock } from "@/components/ui/code-block";

export default function SmsDocsPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1>SMS Messaging</h1>
            <p className="lead">
                The SMS API allows you to send and receive text messages globally.
            </p>
            <h2>Sending Messages</h2>
            <p>
                To send a message, make a POST request to <code>/v1/sms/send</code>. You must specify the <code>to</code> number and the <code>message</code> body.
            </p>
            <CodeBlock language="bash" code={`curl -X POST https://api.nexaline.com/v1/sms/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+15551234567",
    "message": "Hello world!"
  }'`} />
            <h2>Receiving Messages</h2>
            <p>
                Incoming messages are delivered to your valid webhook URL via a POST request. You can configure webhooks in the dashboard.
            </p>
        </div>
    );
}
