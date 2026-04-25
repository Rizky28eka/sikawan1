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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { 
    Clock, 
    Users, 
    MoreHorizontal, 
    Trash2,
    Sun,
    Moon,
    Pencil
} from "lucide-react";

interface Props {
    items: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onViewMembers: (item: any) => void;
    formatTime: (time: string) => string;
}

export default function ShiftTable({ items, onEdit, onDelete, onViewMembers, formatTime }: Props) {
    return (
        <Table>
            <TableHeader className="bg-muted/5">
                <TableRow className="hover:bg-transparent border-b border-border/60">
                    <TableHead className="pl-4 sm:pl-6 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">Detail Shift</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">Jam Kerja</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12 hidden sm:table-cell">Toleransi</TableHead>
                    <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">Mode</TableHead>
                    <TableHead className="text-center text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">Populasi</TableHead>
                    <TableHead className="text-right pr-4 sm:pr-6 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">Opsi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.length > 0 ? (
                    items.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30 border-b border-border/40 group transition-colors">
                            <TableCell className="pl-4 sm:pl-6 py-3 sm:py-4">
                                <div className="space-y-0.5">
                                    <p className="text-xs sm:text-sm font-medium text-foreground leading-none uppercase">{item.name}</p>
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Master Configuration</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary bg-primary/5">
                                    {formatTime(item.start_time)} — {formatTime(item.end_time)}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase">IN: {item.grace_period_check_in || item.late_tolerance || 0}m</span>
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase">OUT: {item.grace_period_check_out || 0}m</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {item.is_night_shift ? (
                                    <div className="flex items-center gap-1.5 text-[9px] font-medium text-indigo-600 uppercase border border-indigo-100 bg-indigo-50 px-2 py-0.5 rounded">
                                        <Moon className="size-3" /> Night
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-[9px] font-medium text-amber-600 uppercase border border-amber-100 bg-amber-50 px-2 py-0.5 rounded">
                                        <Sun className="size-3" /> Day
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 px-2 text-[10px] font-medium hover:bg-primary/5 hover:text-primary gap-1.5"
                                    onClick={(e) => { e.stopPropagation(); onViewMembers(item); }}
                                >
                                    <Users className="size-3 text-muted-foreground" /> {item.users_count} Org
                                </Button>
                            </TableCell>
                            <TableCell className="text-right pr-4 sm:pr-6">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full group-hover:bg-background shadow-none">
                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 border-border/60">
                                        <DropdownMenuLabel className="text-[10px] font-medium uppercase text-muted-foreground px-2 py-1.5">Opsi Master</DropdownMenuLabel>
                                        <DropdownMenuItem className="text-xs font-medium" onClick={() => onEdit(item)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit Record
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-xs font-medium text-rose-600 focus:text-rose-700" onClick={() => onDelete(item.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Hapus Master
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
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/40" />
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
