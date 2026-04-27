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
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    data: any[];
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
    role: string;
}

export default function PerformanceTable({ 
    data, 
    search, 
    onSearchChange, 
    onSearchSubmit, 
    role
}: Props) {
    const getBadgeClass = (count: number) => {
        if (count > 20) return "bg-emerald-500";
        if (count > 10) return "bg-amber-500";
        return "bg-rose-500";
    };

    const getBadgeLabel = (count: number) => {
        if (count > 20) return "Optimal";
        if (count > 10) return "Standar";
        return "Perlu perhatian";
    };

    return (
        <Card className="border-border/60 shadow-none">
            <CardHeader className="space-y-3 border-b pb-3">
                <div>
                    <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
                        <TrendingUp className="h-4 w-4" />
                        Matriks Performa Karyawan
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Ringkasan kehadiran dan aktivitas kerja per karyawan.
                    </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari karyawan..."
                            className="h-8 pl-8 text-xs"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
                        />
                    </div>
                </div>
            </CardHeader>

            {/* Mobile: card list */}
            <div className="divide-y sm:hidden">
                {data.length > 0 ? (
                    data.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="text-xs font-medium">{item.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="truncate text-sm font-medium">{item.name}</span>
                                    <Badge className={cn("shrink-0 text-[10px]", getBadgeClass(item.attendance_count))}>
                                        {getBadgeLabel(item.attendance_count)}
                                    </Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground">{item.department || "Tidak ada departemen"}</p>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="text-muted-foreground">
                                        Hadir: <span className="font-medium text-foreground">{item.attendance_count}</span>
                                    </span>
                                    <span className={cn(item.late_count > 3 ? "text-rose-600" : "text-amber-600")}>
                                        Telat: <span className="font-medium">{item.late_count}</span>
                                    </span>
                                    <span className="text-muted-foreground">{item.working_hours} jam</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="py-10 text-center text-sm text-muted-foreground">Tidak ada data analitik untuk rentang ini.</p>
                )}
            </div>

            {/* Desktop: table */}
            <CardContent className="hidden p-0 sm:block">
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-4">Personel</TableHead>
                                <TableHead>Departemen</TableHead>
                                <TableHead className="text-center">Hadir</TableHead>
                                <TableHead className="text-center">Telat</TableHead>
                                <TableHead className="text-center">Lembur (jam)</TableHead>
                                <TableHead className="pr-4 text-right">Skor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="pl-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs font-medium">{item.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium">{item.name}</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono uppercase">ID: {item.employee_id || "N/A"}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{item.department || "Tidak ada"}</TableCell>
                                        <TableCell className="text-center text-sm font-medium tabular-nums">{item.attendance_count}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={cn("text-sm font-medium tabular-nums", item.late_count > 3 ? "text-rose-600" : "text-amber-600")}>
                                                {item.late_count}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums">{item.working_hours}</span>
                                        </TableCell>
                                        <TableCell className="pr-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className={cn("h-full", getBadgeClass(item.attendance_count))}
                                                        style={{ width: `${Math.min((item.attendance_count / 25) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <Badge className={cn("text-[10px]", getBadgeClass(item.attendance_count))}>
                                                    {getBadgeLabel(item.attendance_count)}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center text-sm text-muted-foreground">Tidak ada data analitik untuk rentang ini.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
