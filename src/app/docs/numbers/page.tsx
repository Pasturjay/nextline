import { CodeBlock } from "@/components/ui/code-block";

export default function NumbersDocsPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1>Virtual Numbers</h1>
            <p className="lead">
                Provision local, mobile, and toll-free numbers in over 50 countries.
            </p>
            <h2>Searching for Numbers</h2>
            <p>
                Use the <code>/v1/numbers/search</code> endpoint to find available numbers by country and type.
            </p>
            <CodeBlock language="bash" code="GET /v1/numbers/search?country=US&type=local" />

            <h2>Buying a Number</h2>
            <p>
                Once you find a number, use <code>/v1/numbers/buy</code> to provision it to your account.
            </p>
            <CodeBlock language="bash" code={`curl -X POST https://api.nexaline.com/v1/numbers/buy \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumber": "+12025550100",
    "country": "US"
  }'`} />
        </div>
    );
}
