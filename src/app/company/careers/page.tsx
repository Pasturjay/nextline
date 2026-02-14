import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <LandingNavbar />
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Join the <span className="text-primary">Revolution</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        We're looking for passionate builders to help us shape the future of global communication.
                    </p>
                    <Link href="#openings">
                        <Button size="lg" className="rounded-full px-8">View Open Roles</Button>
                    </Link>
                </section>

                <section id="openings" className="container mx-auto px-4 mb-20">
                    <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
                    <div className="space-y-4">
                        {[
                            { title: "Senior Backend Engineer", dept: "Engineering", loc: "Remote (US/EU)" },
                            { title: "Product Designer", dept: "Product", loc: "Remote (Global)" },
                            { title: "Developer Advocate", dept: "Marketing", loc: "New York, NY" },
                            { title: "Customer Success Manager", dept: "Sales", loc: "Remote (US)" },
                        ].map((job, i) => (
                            <div key={i} className="flex flex-col md:flex-row justify-between items-center p-6 border rounded-xl hover:border-primary transition-colors bg-card">
                                <div>
                                    <h3 className="text-xl font-bold">{job.title}</h3>
                                    <p className="text-muted-foreground">{job.dept} • {job.loc}</p>
                                </div>
                                <Button variant="ghost" className="mt-4 md:mt-0">Apply Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    );
}
