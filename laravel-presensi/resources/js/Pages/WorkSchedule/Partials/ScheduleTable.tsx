import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { 
    Calendar, 
    MoreHorizontal, 
    Trash2,
    Pencil
} from "lucide-react";

interface Props {
    items: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    formatTime: (time: string) => string;
}

export default function ScheduleTable({ items, onEdit, onDelete, formatTime }: Props) {
    return (
        <Table>
            <TableHeader className="bg-muted/5">
                <TableRow className="hover:bg-transparent border-b border-border/60">
                    <TableHead className="pl-4 sm:pl-6 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">Karyawan</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">Tanggal</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12 hidden sm:table-cell">Jenis Shift</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">Jam Operasional</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">Status</TableHead>
                    <TableHead className="text-right pr-4 sm:pr-6 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">Opsi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.length > 0 ? (
                    items.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 group transition-colors">
                            <TableCell className="pl-4 sm:pl-6 py-3 sm:py-4">
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                    <Avatar className="h-8 w-8 border border-border/60">
                                        <AvatarFallback className="bg-primary/5 text-primary text-[9px] font-medium">
                                            {item.user.full_name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-0.5">
                                        <p className="text-xs sm:text-sm font-medium text-foreground leading-none">{item.user.full_name}</p>
                                        <p className="text-[9px] text-muted-foreground uppercase font-medium tracking-tighter truncate max-w-[80px] sm:max-w-none">
                                            {item.user.employee_id}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-foreground capitalize">
                                        {new Date(item.date).toLocaleDateString("id-ID", { weekday: 'short' })}
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground">
                                        {new Date(item.date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <span className="text-[10px] font-medium text-primary uppercase bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                    {item.shift?.name || 'CUSTOM'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-[10px] font-mono font-medium border-border/60 bg-muted/20">
                                    {formatTime(item.start_time)} - {formatTime(item.end_time)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-medium uppercase tracking-widest px-2 group-hover:bg-emerald-100 transition-colors">On Site</Badge>
                            </TableCell>
                            <TableCell className="text-right pr-4 sm:pr-6">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full group-hover:bg-background shadow-none">
                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 border-border/60">
                                        <DropdownMenuLabel className="text-[10px] font-medium uppercase text-muted-foreground px-2 py-1.5">Opsi Jadwal</DropdownMenuLabel>
                                        <DropdownMenuItem className="text-xs font-medium" onClick={() => onEdit(item)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit Record
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-xs font-medium text-rose-600 focus:text-rose-700" onClick={() => onDelete(item.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus Penugasan
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-48 sm:h-64 text-center">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="size-10 sm:size-12 rounded-full bg-muted flex items-center justify-center">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/40" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs sm:text-sm font-medium text-foreground">Data Tidak Ditemukan</h4>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest leading-relaxed">
                                        Coba sesuaikan filter atau tambahkan master shift.
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
