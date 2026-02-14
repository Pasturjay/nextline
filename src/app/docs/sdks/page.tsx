import { SdkCard } from "./sdk-card";
import Link from "next/link";

export default function SdksPage() {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1>SDKs & Libraries</h1>
            <p className="lead">
                Accelerate your integration with our official server-side helper libraries. We support the most popular languages and frameworks.
            </p>

            <div className="not-prose grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-8">
                <SdkCard
                    language="Node.js"
                    icon={<span className="text-green-600">JS</span>}
                    version="1.2.0"
                    installCmd="npm install nexaline-node"
                    githubUrl="https://github.com/nexaline/nexaline-node"
                />
                <SdkCard
                    language="Python"
                    icon={<span className="text-blue-500">PY</span>}
                    version="0.9.5"
                    installCmd="pip install nexaline"
                    githubUrl="https://github.com/nexaline/nexaline-python"
                />
                <SdkCard
                    language="Go"
                    icon={<span className="text-cyan-500">GO</span>}
                    version="1.0.1"
                    installCmd="go get github.com/nexaline/nexaline-go"
                    githubUrl="https://github.com/nexaline/nexaline-go"
                />
                <SdkCard
                    language="PHP"
                    icon={<span className="text-indigo-500">PHP</span>}
                    version="1.1.0"
                    installCmd="composer require nexaline/nexaline-php"
                    githubUrl="https://github.com/nexaline/nexaline-php"
                />
                <SdkCard
                    language="Ruby"
                    icon={<span className="text-red-600">RB</span>}
                    version="1.0.0"
                    installCmd="gem install nexaline"
                    githubUrl="https://github.com/nexaline/nexaline-ruby"
                />
                <SdkCard
                    language="Java"
                    icon={<span className="text-orange-600">JV</span>}
                    version="1.0.2"
                    installCmd="maven dependency:get ..."
                    githubUrl="https://github.com/nexaline/nexaline-java"
                />
            </div>

            <h2>Community Libraries</h2>
            <p>
                In addition to our official SDKs, the community has built libraries for other languages and frameworks.
            </p>
            <ul>
                <li><strong>C# / .NET</strong> - <Link href="#">nexaline-dotnet</Link></li>
                <li><strong>Rust</strong> - <Link href="#">nexaline-rs</Link></li>
                <li><strong>Elixir</strong> - <Link href="#">ex_nexaline</Link></li>
            </ul>
        </div>
    );
}
