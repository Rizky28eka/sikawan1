import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";

interface Props {
    tab: 'shifts' | 'schedules';
    role: string;
    onAdd: () => void;
}

export default function WorkScheduleHeader({ tab, role, onAdd }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1 sm:px-0">
            <div className="space-y-1">
                <h1 className="text-3xl tracking-tight sm:text-4xl font-medium text-foreground">Jadwal Kerja</h1>
                <p className="text-sm text-muted-foreground font-light">Atur rotasi kerja karyawan dan konfigurasi jam operasional.</p>
            </div>
            {role !== 'EMPLOYEE' && (
                <Button 
                    size="sm" 
                    className="h-10 px-6 shadow-lg shadow-primary/20 text-xs font-medium uppercase tracking-wider" 
                    onClick={onAdd}
                >
                    <Plus className="h-4 w-4 mr-2" /> 
                    {tab === 'shifts' ? 'Tambah Master Shift' : 'Atur Jadwal Kerja'}
                </Button>
            )}
        </div>
    );
}
