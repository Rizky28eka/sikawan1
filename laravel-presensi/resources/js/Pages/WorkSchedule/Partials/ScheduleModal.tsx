import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isEdit: boolean;
    data: any;
    setData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    employees: any[];
    shifts: any[];
}

export default function ScheduleModal({ 
    isOpen, 
    onOpenChange, 
    isEdit, 
    data, 
    setData, 
    onSubmit, 
    processing,
    employees,
    shifts
}: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden mt-auto sm:mt-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/5 text-left">
                    <DialogTitle className="text-lg font-medium">{isEdit ? 'Edit Penugasan Harian' : 'Atur Jadwal Kerja'}</DialogTitle>
                    <DialogDescription className="text-xs font-medium">Tentukan hari dan tipe shift untuk penugasan karyawan tertentu.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Karyawan Terpilih</Label>
                            <Select disabled={isEdit} value={data.user_id} onValueChange={v => setData({ ...data, user_id: v })}>
                                <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Pilih Karyawan..." /></SelectTrigger>
                                <SelectContent className="max-h-[250px]">
                                    {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name} ({e.employee_id})</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Tanggal</Label>
                                <Input type="date" className="h-10 text-sm" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Pilih Master Shift</Label>
                                <Select value={data.shift_id} onValueChange={v => {
                                    const s = shifts.find(x => x.id === v);
                                    if (s) setData({ ...data, shift_id: v, start_time: s.start_time, end_time: s.end_time });
                                }}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Assign Shift..." /></SelectTrigger>
                                    <SelectContent>
                                        {shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Instruksi Khusus</Label>
                            <Textarea className="resize-none h-20 text-xs" value={data.notes} onChange={e => setData({ ...data, notes: e.target.value })} placeholder="Misal: Penugasan Lembur..." />
                        </div>
                    </div>
                    <div className="px-6 py-4 border-t border-border/60 flex items-center justify-end gap-3 bg-muted/5">
                        <Button type="button" variant="ghost" className="h-10 text-xs font-medium uppercase tracking-wider" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button type="submit" className="h-10 px-6 text-xs font-medium uppercase tracking-wider shadow-lg shadow-primary/10" disabled={processing}>Konfirmasi Jadwal</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
