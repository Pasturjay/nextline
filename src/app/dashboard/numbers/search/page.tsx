import { NumberSearchInterface } from "@/components/numbers/number-search"
import { Separator } from "@/components/ui/separator"

export const metadata = {
    title: "Search Numbers - NexaLine",
    description: "Find and purchase virtual numbers",
}

export default function NumberSearchPage() {
    return (
        <div className="space-y-6 p-10 pb-16 block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Search Numbers</h2>
                <p className="text-muted-foreground">
                    Find the perfect virtual number for your business needs.
                </p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <div className="flex-1 lg:max-w-4xl">
                    <NumberSearchInterface />
                </div>
            </div>
        </div>
    )
}
