import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
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
    departmentId?: string;
    employeeId?: string;
    departments: { id: string; name: string }[];
    employeeList: { id: string; full_name: string }[];
    onDateChange: (type: 'start' | 'end', value: string) => void;
    onFilterChange: (type: 'department_id' | 'employee_id', value: string) => void;
    onApply: (e?: React.FormEvent) => void;
    role: string;
}

export default function AnalyticsFilters({ 
    startDate, 
    endDate, 
    departmentId,
    employeeId,
    departments,
    employeeList,
    onDateChange, 
    onFilterChange,
    onApply,
    role
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
                className="flex flex-wrap items-end gap-3 bg-muted/30 p-4 rounded-xl border border-border/40"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Rentang Tanggal</label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => onDateChange('start', e.target.value)}
                                    className="h-9 pl-9 text-xs border-border/60 bg-background"
                                />
                            </div>
                            <span className="shrink-0 text-[10px] font-medium text-muted-foreground">s/d</span>
                            <div className="relative flex-1">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => onDateChange('end', e.target.value)}
                                    className="h-9 pl-9 text-xs border-border/60 bg-background"
                                />
                            </div>
                        </div>
                    </div>

                    {role !== 'EMPLOYEE' && (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Departemen</label>
                                <Select value={departmentId || "all"} onValueChange={(v) => onFilterChange('department_id', v === 'all' ? '' : v)}>
                                    <SelectTrigger className="h-9 text-xs border-border/60 bg-background">
                                        <SelectValue placeholder="Semua Departemen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Departemen</SelectItem>
                                        {departments.map((d) => (
                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Karyawan</label>
                                <Select value={employeeId || "all"} onValueChange={(v) => onFilterChange('employee_id', v === 'all' ? '' : v)}>
                                    <SelectTrigger className="h-9 text-xs border-border/60 bg-background">
                                        <SelectValue placeholder="Semua Karyawan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Karyawan</SelectItem>
                                        {employeeList.map((e) => (
                                            <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-2 w-full lg:w-auto">
                    <Button
                        type="submit"
                        className="h-9 px-6 text-xs font-bold uppercase tracking-wider shadow-sm flex-1 lg:flex-none"
                    >
                        <Search className="h-3.5 w-3.5 mr-2" /> Terapkan
                    </Button>
                </div>
            </form>
        </div>
    );
}
