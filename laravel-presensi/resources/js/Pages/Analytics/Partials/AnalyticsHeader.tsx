import { Button } from "@/Components/ui/button";
import { Download } from "lucide-react";

interface Props {
    onExport: () => void;
}

export default function AnalyticsHeader({ onExport }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1 sm:px-0">
            <div className="space-y-1">
                <h1 className="text-3xl tracking-tight sm:text-4xl font-medium text-foreground">Analisis & Insight</h1>
                <p className="text-sm text-muted-foreground font-light">Performa kehadiran dan audit aktivitas sistem.</p>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="h-10 px-6 shrink-0 gap-1.5 border-border/60 text-xs font-medium uppercase tracking-wider"
            >
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Ekspor Laporan</span>
                <span className="sm:hidden">Ekspor</span>
            </Button>
        </div>
    );
}
