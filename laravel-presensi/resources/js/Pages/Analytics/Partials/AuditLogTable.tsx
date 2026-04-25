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
    CardContent 
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { 
    ShieldCheck, 
    Search, 
    Activity, 
    AlertCircle, 
    LogOut as LogIcon 
} from "lucide-react";
import { format } from "date-fns";
import { router } from "@inertiajs/react";

interface Props {
    data: {
        data: any[];
        current_page: number;
        last_page: number;
        links: any[];
    };
    search: string;
    onSearchChange: (value: string) => void;
}

export default function AuditLogTable({ data, search, onSearchChange }: Props) {
    const getActionIcon = (action: string) => {
        const a = action.toUpperCase();
        if (a.includes("LOGIN")) return <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />;
        if (a.includes("LOGOUT")) return <LogIcon className="h-3.5 w-3.5 text-rose-500" />;
        if (a.includes("DELETE")) return <AlertCircle className="h-3.5 w-3.5 text-rose-600" />;
        return <Activity className="h-3.5 w-3.5 text-amber-500" />;
    };

    return (
        <Card className="border-border/60 shadow-none overflow-hidden">
            <div className="flex flex-col gap-2 rounded-t-lg border-b bg-slate-950 p-3 text-slate-50 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        Digital Audit Trail
                    </div>
                    <p className="text-[11px] text-slate-400">Jejak aktivitas sistem untuk pemantauan keamanan.</p>
                </div>
                <div className="relative sm:w-56">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                    <Input
                        placeholder="Filter audit log..."
                        className="h-8 border-slate-800 bg-slate-900/60 pl-8 text-xs text-slate-50 placeholder:text-slate-500"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Mobile: card list */}
            <div className="divide-y sm:hidden">
                {data.data?.length > 0 ? (
                    data.data.map((log) => (
                        <div key={log.id} className="p-3 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7 shrink-0">
                                        <AvatarFallback className="text-[10px] font-medium">
                                            {log.user?.full_name?.charAt(0) || "S"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-medium">{log.user?.full_name || "SYSTEM"}</p>
                                        <p className="truncate text-[10px] text-muted-foreground">{log.user?.personal_email || "INTERNAL_API"}</p>
                                    </div>
                                </div>
                                <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
                                    {log.created_at ? format(new Date(log.created_at), "dd/MM HH:mm") : "-"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    {getActionIcon(log.action)}
                                    <span className="text-[10px] font-medium uppercase">{log.action || "QUERY"}</span>
                                </div>
                                <Badge variant="outline" className="text-[10px]">{log.module || "CORE"}</Badge>
                            </div>
                            {log.description && <p className="text-[10px] text-muted-foreground">{log.description}</p>}
                        </div>
                    ))
                ) : (
                    <p className="py-10 text-center text-sm text-muted-foreground">Tidak ada audit log untuk rentang ini.</p>
                )}
            </div>

            {/* Desktop: table */}
            <CardContent className="hidden p-0 sm:block">
                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-12">Waktu</TableHead>
                                <TableHead className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-12">Aktor</TableHead>
                                <TableHead className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-12">Aksi</TableHead>
                                <TableHead className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-12">Modul</TableHead>
                                <TableHead className="pr-4 text-right text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-12">Detail</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.data?.length > 0 ? (
                                data.data.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-muted/30">
                                        <TableCell className="pl-4">
                                            <div className="text-sm font-medium tabular-nums">
                                                {log.created_at ? format(new Date(log.created_at), "dd/MM/yyyy") : "-"}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                {log.created_at ? format(new Date(log.created_at), "HH:mm:ss") : "-"} UTC
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs font-medium">
                                                        {log.user?.full_name?.charAt(0) || "S"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-medium">{log.user?.full_name || "SYSTEM"}</div>
                                                    <div className="truncate text-[10px] text-muted-foreground">{log.user?.personal_email || "INTERNAL_API"}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                {getActionIcon(log.action)}
                                                <span className="text-xs font-medium uppercase">{log.action || "QUERY"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px]">{log.module || "CORE"}</Badge>
                                        </TableCell>
                                        <TableCell className="pr-4 text-right">
                                            <p className="ml-auto max-w-xs text-[11px] text-muted-foreground">{log.description || "System generated event."}</p>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center text-sm text-muted-foreground">Tidak ada audit log untuk rentang ini.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {/* Pagination */}
            {data.last_page > 1 && (
                <div className="flex items-center justify-between border-t bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
                    <span>Hal. {data.current_page} / {data.last_page}</span>
                    <div className="flex flex-wrap items-center gap-1">
                        {data.links?.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                disabled={!link.url || link.active}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className="h-7 min-w-[28px] px-2 text-xs"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
