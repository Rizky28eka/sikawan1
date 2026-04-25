import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { Users, Clock, LogOut, AlertCircle, Activity } from "lucide-react";

interface Stats {
    attendance: number;
    late: number;
    leave: number;
    absent: number;
    hours: number;
}

interface Props {
    stats: Stats;
}

export default function StatCards({ stats }: Props) {
    const list = [
        {
            title: "Kehadiran",
            value: stats.attendance,
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            title: "Terlambat",
            value: stats.late,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            title: "Hari Cuti",
            value: stats.leave,
            icon: LogOut,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Absensi",
            value: stats.absent,
            icon: AlertCircle,
            color: "text-rose-600",
            bg: "bg-rose-50",
        },
        {
            title: "Jam Kerja",
            value: stats.hours,
            icon: Activity,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            unit: "jam",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {list.map((stat, i) => (
                <Card key={i} className="border-border/60 shadow-none">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] text-muted-foreground sm:text-xs">
                                {stat.title}
                            </p>
                            <div className={cn("rounded-md p-1.5", stat.bg)}>
                                <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-lg font-medium tabular-nums sm:text-xl">
                                {stat.value}
                            </span>
                            {stat.unit && (
                                <span className="text-[10px] text-muted-foreground">
                                    {stat.unit}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
