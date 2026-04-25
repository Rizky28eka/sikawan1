import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { 
    Users, 
    Loader2,
    X,
    CheckCircle2
} from "lucide-react";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    shiftName: string;
    members: any[];
    loading: boolean;
}

export default function MembersModal({ 
    isOpen, 
    onOpenChange, 
    shiftName, 
    members, 
    loading 
}: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden mt-auto sm:mt-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/5 text-left">
                    <DialogTitle className="text-lg font-medium">Populasi Shift: {shiftName}</DialogTitle>
                    <DialogDescription className="text-xs font-medium uppercase tracking-widest text-primary">Daftar anggota aktif terikat</DialogDescription>
                </DialogHeader>
                <div className="p-4 max-h-[50vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-50">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Menarik database...</span>
                        </div>
                    ) : members.length > 0 ? (
                        <div className="space-y-2">
                            {members.map(m => (
                                <div key={m.id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-border/60">
                                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">{m.full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium leading-tight">{m.full_name}</span>
                                            <span className="text-[10px] text-muted-foreground italic uppercase tracking-tighter font-medium">{m.employee_id} · {m.position}</span>
                                        </div>
                                    </div>
                                    {m.status ? <CheckCircle2 className="size-4 text-emerald-500" /> : <X className="size-4 text-muted-foreground" />}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 opacity-30">
                            <Users className="h-10 w-10 mx-auto mb-3" />
                            <p className="text-xs font-medium uppercase tracking-widest">Shift Kosong</p>
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-border/60 bg-muted/5">
                    <Button variant="outline" className="w-full h-10 text-xs font-medium uppercase tracking-wider border-border/60" onClick={() => onOpenChange(false)}>Selesai</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
