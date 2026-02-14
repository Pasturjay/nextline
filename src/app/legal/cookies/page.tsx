import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
                    <p className="text-muted-foreground mb-8">Last updated: February 13, 2026</p>

                    <div className="prose dark:prose-invert max-w-none space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
                            <p>
                                Cookies are small text files that are set on your computer or other device when you visit websites. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
                            <p>
                                We use cookies for the following purposes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off in our systems.</li>
                                <li><strong>Performance Cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
                                <li><strong>Functional Cookies:</strong> These enable the website to provide enhanced functionality and personalization.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">3. Managing Cookies</h2>
                            <p>
                                Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit allaboutcookies.org.
                            </p>
                        </section>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
}
