import GeneralAnalytics from "@/components/dashboard/analytics/general-analytics";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">
                    Overview of your communication usage and performance.
                </p>
            </div>
            <GeneralAnalytics />
        </div>
    );
}
