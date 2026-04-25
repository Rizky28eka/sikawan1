import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/Components/ui/table";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    data: any[];
}

export default function ResearchReportTable({ data }: Props) {
    return (
        <Card className="border-border/60 shadow-none overflow-hidden">
            <CardHeader className="border-b bg-indigo-50/50 pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-indigo-950">
                            <TrendingUp className="h-4 w-4" />
                            Laporan Pengujian Biometrik Dinamis
                        </CardTitle>
                        <CardDescription className="text-[11px] text-indigo-700/70">
                            Evaluasi performa AI Face Recognition dalam berbagai kondisi lingkungan.
                        </CardDescription>
                    </div>
                    <Badge className="bg-indigo-600">Research & Development</Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[50px] pl-4 text-xs font-medium uppercase text-slate-600">No</TableHead>
                                <TableHead className="min-w-[150px] text-xs font-medium uppercase text-slate-600">Nama Pengguna</TableHead>
                                <TableHead className="min-w-[200px] text-xs font-medium uppercase text-slate-600">Kondisi Pengujian</TableHead>
                                <TableHead className="text-center text-xs font-medium uppercase text-slate-600">Jml Frame (Collect/Valid)</TableHead>
                                <TableHead className="text-center text-xs font-medium uppercase text-slate-600">Durasi (s)</TableHead>
                                <TableHead className="text-center text-xs font-medium uppercase text-slate-600">Kualitas</TableHead>
                                <TableHead className="text-center text-xs font-medium uppercase text-slate-600">Deteksi</TableHead>
                                <TableHead className="text-center text-xs font-medium uppercase text-slate-600">Pengenalan</TableHead>
                                <TableHead className="text-center text-xs font-medium uppercase text-slate-600">Confidence</TableHead>
                                <TableHead className="text-center text-xs font-medium uppercase text-slate-600">Stabilitas</TableHead>
                                <TableHead className="min-w-[120px] text-xs font-medium uppercase text-slate-600">Pose</TableHead>
                                <TableHead className="min-w-[150px] text-xs font-medium uppercase text-slate-600">Alasan Berhenti</TableHead>
                                <TableHead className="pr-4 text-right text-xs font-medium uppercase text-slate-600">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((row) => (
                                    <TableRow key={row.id || row.no} className="hover:bg-indigo-50/30">
                                        <TableCell className="pl-4 text-xs tabular-nums text-slate-500">{row.no}</TableCell>
                                        <TableCell className="text-xs font-medium text-slate-900">{row.user_name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[11px] font-medium text-slate-700">{row.testing_condition}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Badge variant="outline" className="h-5 px-1.5 text-[10px] tabular-nums">{row.frames_collected}</Badge>
                                                <span className="text-slate-300">/</span>
                                                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] tabular-nums bg-emerald-50 text-emerald-700 border-emerald-100">{row.frames_valid}</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-xs tabular-nums font-medium text-slate-600">{row.duration}s</TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={cn("text-[9px] px-1.5 h-4", 
                                                row.frame_quality.includes("Jelas") ? "bg-emerald-500" : "bg-amber-500"
                                            )}>
                                                {row.frame_quality}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-[11px] text-slate-600">{row.face_detected}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={cn("text-[11px] font-medium", 
                                                row.recognition_result.includes("Match") ? "text-emerald-600" : "text-rose-600"
                                            )}>
                                                {row.recognition_result}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-[11px] font-medium tabular-nums text-slate-700">{row.confidence_score}%</span>
                                                <div className="h-1 w-12 rounded-full bg-slate-100 overflow-hidden">
                                                    <div 
                                                        className={cn("h-full", row.confidence_score > 60 ? "bg-emerald-500" : "bg-rose-500")}
                                                        style={{ width: `${row.confidence_score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={cn("text-[11px] font-medium", 
                                                row.embedding_stability.includes("Stabil") ? "text-emerald-600" : "text-amber-600"
                                            )}>
                                                {row.embedding_stability}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-[11px] text-slate-500">{row.pose_variation}</TableCell>
                                        <TableCell className="text-[11px] text-slate-500 italic">{row.stop_reason}</TableCell>
                                        <TableCell className="pr-4 text-right">
                                            <Badge className={cn("h-5 text-[10px]", 
                                                row.final_status === "Berhasil" ? "bg-emerald-600" : "bg-rose-600"
                                            )}>
                                                {row.final_status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={13} className="h-32 text-center text-xs text-slate-400">
                                        Data pengujian belum tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
