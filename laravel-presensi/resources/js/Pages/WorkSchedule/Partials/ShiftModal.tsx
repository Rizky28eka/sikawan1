import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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
    setData: (key: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
}

export default function ShiftModal({ 
    isOpen, 
    onOpenChange, 
    isEdit, 
    data, 
    setData, 
    onSubmit, 
    processing 
}: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden mt-auto sm:mt-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/5 text-left">
                    <DialogTitle className="text-lg font-medium">{isEdit ? 'Konfigurasi Shift' : 'Tambah Master Shift'}</DialogTitle>
                    <DialogDescription className="text-xs font-medium">Tentukan parameter jam kerja operasional dan toleransi presensi.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Nama / Label Shift</Label>
                            <Input placeholder="Contoh: Morning Staff" className="h-10 text-sm" value={data.name} onChange={e => setData('name', e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Jam Mulai</Label>
                                <Input type="time" className="h-10 text-sm" value={data.start_time} onChange={e => setData('start_time', e.target.value)} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Jam Selesai</Label>
                                <Input type="time" className="h-10 text-sm" value={data.end_time} onChange={e => setData('end_time', e.target.value)} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Toleransi Telat (Mnt)</Label>
                                <Input type="number" className="h-10 text-sm" value={data.grace_period_check_in} onChange={e => setData('grace_period_check_in', parseInt(e.target.value))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Pulang Awal (Mnt)</Label>
                                <Input type="number" className="h-10 text-sm" value={data.grace_period_check_out} onChange={e => setData('grace_period_check_out', parseInt(e.target.value))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Minimal Jam Kerja</Label>
                                <Input type="number" step="0.5" className="h-10 text-sm" value={data.minimum_work_hours} onChange={e => setData('minimum_work_hours', parseFloat(e.target.value))} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Mode Shift</Label>
                                <Select value={data.is_night_shift ? 'true' : 'false'} onValueChange={v => setData('is_night_shift', v === 'true')}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="false">Siang (Day)</SelectItem>
                                        <SelectItem value="true">Malam (Overnight)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 border-t border-border/60 flex items-center justify-end gap-3 bg-muted/5">
                        <Button type="button" variant="ghost" className="h-10 text-xs font-medium uppercase tracking-wider" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button type="submit" className="h-10 px-6 text-xs font-medium uppercase tracking-wider shadow-lg shadow-primary/10" disabled={processing}>Simpan Master</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
