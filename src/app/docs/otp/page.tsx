import { CodeBlock } from "@/components/ui/code-block";

export default function OtpDocsPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1>OTP Verification</h1>
            <p className="lead">
                Secure your users with our built-in One-Time Password service.
            </p>
            <h2>Sending a Code</h2>
            <p>
                Call <code>/v1/otp/send</code> with a phone number. We will generate a secure 6-digit code and send it via SMS.
            </p>
            <CodeBlock language="bash" code={`curl -X POST https://api.nexaline.com/v1/otp/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumber": "+15559998888"
  }'`} />

            <h2>Verifying a Code</h2>
            <p>
                When the user enters the code, call <code>/v1/otp/verify</code> to check if it matches.
            </p>
            <CodeBlock language="bash" code={`curl -X POST https://api.nexaline.com/v1/otp/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumber": "+15559998888",
    "code": "123456"
  }'`} />
        </div>
    );
}
