import { Separator } from "@/components/ui/separator"
import { Check } from "lucide-react"
import { ExpenseStats, ExpenseStatusResponse } from "@/lib/types"


interface ListProps {
    data: ExpenseStatusResponse
}

export default function ExpenseStatusList( { data }: ListProps) {
    const known = Object.entries(data).filter(([, s]) => s.expected != null)
    const unexpected = Object.entries(data).filter(([, s]) => s.expected == null)

    return (
        <div className="flex flex-col w-full gap-4">            
            {known.map(([supplier, stats]) => (
                <ExpenseStatusCard key={supplier} supplier={supplier} stats={stats} />
            ))}
            <Separator />
            {unexpected.map(([supplier, stats]) => (
                <ExpenseStatusCard key={supplier} supplier={supplier} stats={stats} />
            ))}
        </div>
    )
}


interface CardProps {
    supplier: string
    stats: ExpenseStats
}

function ExpenseStatusCard({ supplier, stats }: CardProps) {
    return (
        <div className="relative flex flex-col mx-4 gap-2 border-2 rounded-2xl py-2">
    
            {stats.missing === 0 && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                </div>
            )}
        
            <div className="flex flex-col mx-4 gap-2">       
                <div className="flex justify-center">
                    <span className="text-sm font-semibold">{supplier}</span>
                </div>

                <div className="flex justify-center gap-2">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-center">expected</span>
                        <span className="text-xs text-center">{stats.expected ?? "-"}</span>
                    </div>
                    <Separator orientation="vertical"/> 
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-center">Reported</span>
                        <span className="text-xs text-center">{stats.actual}</span>
                    </div>
                    <Separator orientation="vertical"/> 
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-center">Missing</span>
                        <span className="text-xs text-center">{stats.missing}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}