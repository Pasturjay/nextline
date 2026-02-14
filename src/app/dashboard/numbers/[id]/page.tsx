import NumberConfigDashboard from "@/components/dashboard/number-config";

export default async function NumberDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Number Configuration</h2>
            <NumberConfigDashboard numberId={id} />
        </div>
    );
}
