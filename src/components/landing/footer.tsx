import Link from "next/link";
import { Globe, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="border-t py-16 bg-slate-900 text-white relative overflow-hidden">
            {/* Gradient Border Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    <div className="space-y-6">
                        <Link className="flex items-center gap-2" href="#">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                                <Globe className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">NexaLine</span>
                        </Link>
                        <p className="text-slate-400 max-w-xs leading-relaxed">
                            Your passport to global connectivity. Virtual numbers, travel eSIMs, and instant OTP verification in one app.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/product/numbers" className="hover:text-cyan-400 transition-colors">Virtual Numbers</Link></li>
                            <li><Link href="/product/travel" className="hover:text-cyan-400 transition-colors">Travel eSIM</Link></li>
                            <li><Link href="/product/sms" className="hover:text-cyan-400 transition-colors">Instant OTP</Link></li>
                            <li><Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/company/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                            <li><Link href="/company/careers" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
                            <li><Link href="/company/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
                            <li><Link href="/company/faq" className="hover:text-cyan-400 transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Legal</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/legal/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-cyan-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6 text-lg">Get the App</h4>
                        <div className="flex flex-col gap-4">
                            <p className="text-sm text-slate-400 mb-2">Download our mobile app for seamless connectivity on the go.</p>
                            <Link href="#" className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-3 transition-all group">
                                <AppleLogo className="h-8 w-8 text-white group-hover:text-gray-200 fill-current" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] uppercase font-medium text-slate-400">Download on the</span>
                                    <span className="text-sm font-bold text-white">App Store</span>
                                </div>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-3 transition-all group">
                                <GooglePlayLogo className="h-8 w-8 text-white group-hover:text-gray-200 fill-current" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] uppercase font-medium text-slate-400">Get it on</span>
                                    <span className="text-sm font-bold text-white">Google Play</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© 2026 NexaLine Inc. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 transition-all">
                            <Facebook className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 transition-all">
                            <Instagram className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 transition-all">
                            <TikTokLogo className="h-5 w-5 fill-current" />
                        </Link>
                        <Link href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 transition-all">
                            <SnapchatLogo className="h-5 w-5 fill-current" />
                        </Link>
                        <Link href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 transition-all">
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 transition-all">
                            <Youtube className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 transition-all">
                            <Linkedin className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function AppleLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" className={className} {...props}>
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.958 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.415-2.376-2.014-.157-3.663 1.078-4.585 1.078zm2.467-5.324c.908-1.1 1.52-2.584 1.35-4.077-1.311.052-2.909.845-3.83 1.961-.832.987-1.533 2.572-1.351 4.026 1.467.117 2.948-.792 3.831-1.91z" fill="currentColor" />
        </svg>
    );
}

function GooglePlayLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" className={className} {...props}>
            <path d="M3.609 1.814L13.792 12 3.61 22.186a2.126 2.126 0 0 1-1.397-2.01V3.824a2.126 2.126 0 0 1 1.397-2.01zM15.208 13.418L19.453 17.662l-1.414 1.415-4.243-4.243 1.414-1.414zM15.208 10.582l1.414-1.414 4.243 4.243-1.414 1.415-4.243-4.243zM18.292 9.418l-4.243 4.243 4.243 4.243 1.414-1.415-4.243-4.243L18.292 9.418z" fill="currentColor" />
            <path d="M21.453 10.582l-2.83 2.829-2.828-2.829 2.828-2.828 2.83 2.828z" fill="#34A853" />
            <path d="M14.7 10.6l-8.5-4.9c-.3-.2-.5-.5-.5-.8V2.1l9 9z" fill="#EA4335" />
            <path d="M14.7 13.4L6.2 18.3l-.5.3v-2.8l9-2.4z" fill="#FBBC04" />
            <path d="M14.7 13.4l2.1-1.2 2.1-1.2-4.2-2.4-4.2 2.4z" fill="#34A853" />
            <path d="M6.2 5.7v12.6c0 .8.9 1.3 1.6.9l8.6-4.9-1.3-.8-8.9 5.2z" fill="#4285F4" />
        </svg>
    );
}

function TikTokLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" className={className} {...props}>
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.76v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-3.11 6.15-2.12 1.51-4.73 2.38-7.23 1.34-2.15-1.01-3.61-3.08-3.95-5.59-.04-.55-.04-1.1 0-1.65.31-2.9 2.58-5.32 5.51-5.69v4.22c-1.22.15-2.27 1.05-2.48 2.27-.19 1.48 1.07 2.76 2.52 2.82 1.33.02 2.45-1.01 2.52-2.33.01-4.66.01-9.32.01-13.98l-7.87.01c0-1.35 0-2.7 0-4.05 1.34.02 2.68.01 4.02.02z" fill="currentColor" />
        </svg>
    );
}

function SnapchatLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" className={className} {...props}>
            <path d="M12.02 2c-3.77 0-6.17 3.32-6.2 5.29-.01 1.09.28 2.06.67 2.63.2.29.17.65-.05.94-.3.41-.85 1.05-.18 2.02.32.47.88.58 1.25.68.27.08.38.38.35.63l-.06.4c-.09.68-.44 3.06-2.67 3.06-.43 0-.74.19-.88.54-.12.31-.05.7.22 1 .83.92 2.6.59 3.51.41.65-.13 1.27-.25 1.79.08.18.11.37.28.58.46.6.53 1.3.83 1.67.83h.01c.36 0 1.07-.3 1.66-.83.21-.18.4-.35.58-.46.52-.33 1.13-.21 1.78-.08.92.18 2.68.51 3.51-.41.27-.3.33-.69.22-1-.14-.35-.45-.54-.88-.54-2.23 0-2.58-2.38-2.67-3.06l-.06-.4c-.03-.25.08-.55.35-.63.37-.1 1.37-.18 1.69-1.15.15-.47.11-1.02-.12-1.52-.22-.29-.25-.65-.05-.94.39-.57.68-1.54.67-2.63-.03-1.92-2.43-5.31-6.19-5.31" fill="currentColor" />
        </svg>
    );
}
