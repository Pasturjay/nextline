import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
                    <p className="text-muted-foreground mb-8">Last updated: February 15, 2026</p>

                    <div className="prose dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
                            <p>
                                By accessing or using the NexaLine platform ("Service"), you agree to be bound by these Terms and Conditions ("Terms").
                                If you disagree with any part of these terms, you may not access the Service. These Terms apply to all visitors, users,
                                and others who access or use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">2. Services Provided</h2>
                            <p className="mb-3">NexaLine provides the following telecommunications services:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Virtual Phone Numbers:</strong> Rental and purchase of local, toll-free, and mobile numbers from 150+ countries</li>
                                <li><strong>SMS OTP Services:</strong> Instant SMS verification codes for account security and authentication</li>
                                <li><strong>Travel eSIM:</strong> Digital SIM cards for international data connectivity</li>
                                <li><strong>API Access:</strong> Programmatic access to our services for developers and businesses</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">3. Account Registration and Responsibilities</h2>
                            <p className="mb-3">
                                To use certain features of the Service, you must register for an account. You agree to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide accurate, current, and complete information during registration</li>
                                <li>Maintain and promptly update your account information</li>
                                <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                                <li>Notify us immediately of any unauthorized use of your account</li>
                                <li>Be responsible for all activities that occur under your account</li>
                            </ul>
                            <p className="mt-3">
                                You may not use another user's account without permission. We reserve the right to suspend or terminate accounts
                                that violate these Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
                            <p className="mb-3">You agree NOT to use the Service to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Send spam, unsolicited messages, or engage in any form of harassment</li>
                                <li>Violate any applicable laws, regulations, or third-party rights</li>
                                <li>Transmit malware, viruses, or any harmful code</li>
                                <li>Engage in fraudulent activities or identity theft</li>
                                <li>Interfere with or disrupt the Service or servers</li>
                                <li>Bypass any security measures or access restrictions</li>
                                <li>Use the Service for illegal activities including but not limited to money laundering, terrorism, or drug trafficking</li>
                                <li>Send messages containing threats, hate speech, or explicit content</li>
                                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                            </ul>
                            <p className="mt-3">
                                Violation of this policy may result in immediate termination of your account and legal action.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">5. Virtual Numbers - Specific Terms</h2>
                            <p className="mb-3"><strong>5.1 Number Availability:</strong> Virtual numbers are subject to availability and regulatory requirements.
                                We do not guarantee the availability of specific numbers or area codes.</p>

                            <p className="mb-3"><strong>5.2 Number Ownership:</strong> You do not own the virtual numbers. You are granted a license to use
                                the numbers for the duration of your subscription or one-time purchase period.</p>

                            <p className="mb-3"><strong>5.3 Number Portability:</strong> Virtual numbers provided through our Service are generally not portable
                                to other carriers. Numbers may be reclaimed if subscription expires or is terminated.</p>

                            <p className="mb-3"><strong>5.4 Emergency Services:</strong> Virtual numbers may not support emergency services (911, 999, 112, etc.).
                                Do not rely on virtual numbers for emergency communications.</p>

                            <p className="mb-3"><strong>5.5 Regulatory Compliance:</strong> You are responsible for complying with all local regulations
                                regarding the use of virtual numbers in your jurisdiction.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">6. SMS and Messaging Services</h2>
                            <p className="mb-3"><strong>6.1 Message Delivery:</strong> While we strive for 99.9% delivery rates, we cannot guarantee delivery
                                of all messages due to carrier restrictions, network issues, or recipient device limitations.</p>

                            <p className="mb-3"><strong>6.2 Message Content:</strong> You are solely responsible for the content of messages sent through
                                our Service. Messages must comply with applicable laws and our Acceptable Use Policy.</p>

                            <p className="mb-3"><strong>6.3 Opt-Out Compliance:</strong> If you send marketing messages, you must provide recipients with
                                a clear opt-out mechanism and honor all opt-out requests immediately.</p>

                            <p className="mb-3"><strong>6.4 Rate Limits:</strong> We may impose rate limits on message sending to prevent abuse and ensure
                                service quality for all users.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">7. eSIM Services</h2>
                            <p className="mb-3"><strong>7.1 Device Compatibility:</strong> eSIM services require compatible devices. You are responsible
                                for ensuring your device supports eSIM technology before purchase.</p>

                            <p className="mb-3"><strong>7.2 Data Usage:</strong> Data packages are subject to fair use policies. Excessive usage may result
                                in throttling or service suspension.</p>

                            <p className="mb-3"><strong>7.3 Coverage:</strong> Coverage depends on partner networks in each country. We do not guarantee
                                coverage in all areas and coverage maps are estimates only.</p>

                            <p className="mb-3"><strong>7.4 Activation:</strong> eSIM profiles must be activated within the specified timeframe after purchase.
                                Unused profiles may expire without refund.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">8. Billing and Payments</h2>
                            <p className="mb-3"><strong>8.1 Pricing:</strong> All prices are displayed in USD unless otherwise specified. Prices are subject
                                to change with 30 days' notice for existing subscriptions.</p>

                            <p className="mb-3"><strong>8.2 Payment Methods:</strong> We accept credit cards, debit cards, and other payment methods as displayed.
                                You authorize us to charge your payment method for all fees incurred.</p>

                            <p className="mb-3"><strong>8.3 Subscriptions:</strong> Subscription services renew automatically unless canceled before the renewal date.
                                You will be charged the then-current rate for your subscription.</p>

                            <p className="mb-3"><strong>8.4 Refunds:</strong> Refunds are provided at our discretion. Generally, virtual number setup fees and
                                eSIM activations are non-refundable. Unused subscription time may be refunded on a pro-rata basis.</p>

                            <p className="mb-3"><strong>8.5 Failed Payments:</strong> If payment fails, we may suspend your service until payment is received.
                                Repeated payment failures may result in account termination.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">9. Service Availability and Uptime</h2>
                            <p>
                                We strive to maintain 99.9% uptime for our services. However, we do not guarantee uninterrupted or error-free service.
                                The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control including
                                but not limited to natural disasters, carrier outages, or cyber attacks. We are not liable for any losses resulting
                                from service interruptions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">10. API Usage</h2>
                            <p className="mb-3"><strong>10.1 API Keys:</strong> API keys are confidential and must not be shared. You are responsible for
                                all activity under your API keys.</p>

                            <p className="mb-3"><strong>10.2 Rate Limits:</strong> API usage is subject to rate limits based on your subscription tier.
                                Exceeding rate limits may result in temporary blocking.</p>

                            <p className="mb-3"><strong>10.3 API Changes:</strong> We may modify, deprecate, or discontinue API endpoints with reasonable notice.
                                We will maintain backward compatibility where possible.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">11. Intellectual Property</h2>
                            <p>
                                The Service and its original content, features, and functionality are owned by NexaLine and are protected by international
                                copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute,
                                sell, or lease any part of our Service without explicit written permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">12. Privacy and Data Protection</h2>
                            <p>
                                Your use of the Service is also governed by our Privacy Policy. We collect, use, and protect your personal information
                                as described in our Privacy Policy. By using the Service, you consent to such processing and you warrant that all data
                                provided by you is accurate.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">13. Limitation of Liability</h2>
                            <p className="mb-3">
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXALINE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                                OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA,
                                USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Your use or inability to use the Service</li>
                                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                                <li>Any interruption or cessation of transmission to or from the Service</li>
                                <li>Any bugs, viruses, trojan horses, or the like that may be transmitted through the Service by any third party</li>
                                <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content</li>
                            </ul>
                            <p className="mt-3">
                                OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">14. Indemnification</h2>
                            <p>
                                You agree to indemnify, defend, and hold harmless NexaLine, its officers, directors, employees, agents, and affiliates
                                from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising
                                out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation
                                of any rights of another party.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">15. Termination</h2>
                            <p className="mb-3">
                                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any
                                reason, including but not limited to breach of these Terms. Upon termination:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Your right to use the Service will immediately cease</li>
                                <li>All virtual numbers assigned to your account will be released</li>
                                <li>Any outstanding balances become immediately due</li>
                                <li>We may delete your account data after a reasonable retention period</li>
                            </ul>
                            <p className="mt-3">
                                You may terminate your account at any time through your account settings or by contacting support.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">16. Governing Law and Dispute Resolution</h2>
                            <p className="mb-3">
                                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to
                                its conflict of law provisions.
                            </p>
                            <p className="mb-3">
                                Any disputes arising from these Terms or the Service shall first be attempted to be resolved through good faith negotiations.
                                If negotiations fail, disputes shall be resolved through binding arbitration in accordance with the rules of [Arbitration Body].
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">17. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least
                                30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole
                                discretion. By continuing to access or use our Service after revisions become effective, you agree to be bound by the
                                revised terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">18. Severability</h2>
                            <p>
                                If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted
                                to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining
                                provisions will continue in full force and effect.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">19. Waiver</h2>
                            <p>
                                No waiver by NexaLine of any term or condition set forth in these Terms shall be deemed a further or continuing waiver
                                of such term or condition or a waiver of any other term or condition, and any failure to assert a right or provision
                                under these Terms shall not constitute a waiver of such right or provision.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">20. Contact Information</h2>
                            <p className="mb-3">
                                If you have any questions about these Terms, please contact us:
                            </p>
                            <ul className="list-none space-y-2">
                                <li><strong>Email:</strong> legal@nexaline.com</li>
                                <li><strong>Support:</strong> support@nexaline.com</li>
                                <li><strong>Address:</strong> [Your Company Address]</li>
                            </ul>
                        </section>

                        <section className="border-t pt-6 mt-8">
                            <p className="text-sm text-muted-foreground">
                                By using NexaLine, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                            </p>
                        </section>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
}
