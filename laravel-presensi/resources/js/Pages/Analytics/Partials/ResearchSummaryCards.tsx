import { Card, CardContent } from "@/Components/ui/card";
import { ShieldCheck, Activity, TrendingUp } from "lucide-react";

interface Props {
    summary: {
        accuracy: string;
        avg_duration: string;
        model_version: string;
    };
}

export default function ResearchSummaryCards({ summary }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-emerald-50/30 border-emerald-100 shadow-none">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[11px] text-emerald-700 font-medium uppercase tracking-wider">Akurasi Pengenalan</p>
                        <p className="text-2xl font-medium text-emerald-900">{summary.accuracy}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-indigo-50/30 border-indigo-100 shadow-none">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-[11px] text-indigo-700 font-medium uppercase tracking-wider">Rata-rata Durasi</p>
                        <p className="text-2xl font-medium text-indigo-900">{summary.avg_duration}</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-slate-50/30 border-slate-100 shadow-none">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-700 font-medium uppercase tracking-wider">Stabilitas Model</p>
                        <p className="text-2xl font-medium text-slate-900">{summary.model_version}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
