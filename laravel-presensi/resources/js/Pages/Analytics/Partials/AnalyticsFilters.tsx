import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { 
    CalendarDays, 
    Search, 
    BarChart3, 
    ShieldCheck, 
    Activity 
} from "lucide-react";

interface Props {
    startDate: string;
    endDate: string;
    onDateChange: (type: 'start' | 'end', value: string) => void;
    onApply: (e?: React.FormEvent) => void;
}

export default function AnalyticsFilters({ 
    startDate, 
    endDate, 
    onDateChange, 
    onApply 
}: Props) {
    return (
        <div className="space-y-4">
            <TabsList className="h-10 sm:h-11 p-1 bg-muted/50 border-none w-full sm:w-auto overflow-x-auto justify-start no-scrollbar">
                <TabsTrigger
                    value="reports"
                    className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-5 data-[state=active]:bg-background font-medium gap-1.5"
                >
                    <BarChart3 className="h-3.5 w-3.5" />
                    Laporan Bisnis
                </TabsTrigger>
                <TabsTrigger
                    value="activity"
                    className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-5 data-[state=active]:bg-background font-medium gap-1.5"
                >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Audit Log
                </TabsTrigger>
                <TabsTrigger
                    value="research"
                    className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-5 data-[state=active]:bg-background font-medium gap-1.5"
                >
                    <Activity className="h-3.5 w-3.5" />
                    Laporan Riset
                </TabsTrigger>
            </TabsList>

            <form
                onSubmit={onApply}
                className="flex flex-wrap items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border/40"
            >
                <div className="flex items-center gap-2 flex-1 min-w-[300px]">
                    <div className="relative flex-1">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => onDateChange('start', e.target.value)}
                            className="h-10 sm:h-11 pl-9 text-sm border-border/60 bg-background"
                        />
                    </div>
                    <span className="shrink-0 text-xs font-medium text-muted-foreground uppercase tracking-widest">s/d</span>
                    <div className="relative flex-1">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => onDateChange('end', e.target.value)}
                            className="h-10 sm:h-11 pl-9 text-sm border-border/60 bg-background"
                        />
                    </div>
                </div>
                <Button
                    type="submit"
                    size="sm"
                    className="h-10 sm:h-11 px-6 text-xs font-medium uppercase tracking-wider shadow-lg shadow-primary/10 flex-1 sm:flex-none"
                >
                    <Search className="h-4 w-4 mr-2" /> Terapkan Filter
                </Button>
            </form>
        </div>
    );
}
