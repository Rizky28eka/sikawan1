import { useState, useEffect } from "react";
import { Card } from "@/Components/ui/card";
import { Clock } from "lucide-react";

interface AttendanceHeaderProps {
    type: string;
    siteName?: string;
    shiftName?: string;
}

export default function AttendanceHeader({
    type,
    siteName,
    shiftName,
}: AttendanceHeaderProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Presensi {type === "CLOCK_IN" ? "Masuk" : "Keluar"}
                </h1>
                <p className="text-muted-foreground">
                    {siteName || "Pusat"} • {shiftName || "Shift Reguler"}
                </p>
            </div>

            <Card className="flex items-center gap-4 px-6 py-3 shadow-sm border-muted/50">
                <Clock className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                    <span className="text-xl font-mono font-bold tabular-nums">
                        {currentTime.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        {currentTime.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                </div>
            </Card>
        </div>
    );
}
