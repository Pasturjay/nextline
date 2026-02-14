export default function ErrorsDocsPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1>Errors</h1>
            <p className="lead">
                NexaLine uses standard HTTP status codes to indicate the success or failure of an API request.
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>200 OK</code></td>
                        <td>The request was successful.</td>
                    </tr>
                    <tr>
                        <td><code>400 Bad Request</code></td>
                        <td>The request was invalid or missing parameters.</td>
                    </tr>
                    <tr>
                        <td><code>401 Unauthorized</code></td>
                        <td>Authentication failed (missing or invalid API key).</td>
                    </tr>
                    <tr>
                        <td><code>402 Payment Required</code></td>
                        <td>Insufficient funds or account suspended.</td>
                    </tr>
                    <tr>
                        <td><code>404 Not Found</code></td>
                        <td>The requested resource does not exist.</td>
                    </tr>
                    <tr>
                        <td><code>500 Internal Error</code></td>
                        <td>Something went wrong on our end.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
