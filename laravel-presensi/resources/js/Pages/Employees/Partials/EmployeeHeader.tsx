import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";

interface EmployeeHeaderProps {
    onInviteClick: () => void;
}

export default function EmployeeHeader({ onInviteClick }: EmployeeHeaderProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between px-1 sm:px-0">
            <div>
                <h1 className="text-3xl tracking-tight sm:text-4xl font-medium">
                    Karyawan
                </h1>
                <p className="text-sm text-muted-foreground font-light">
                    Kelola daftar karyawan, undangan, dan status verifikasi wajah.
                </p>
            </div>
            <Button
                size="sm"
                className="h-10 px-6 shadow-lg shadow-primary/20 text-xs font-medium uppercase"
                onClick={onInviteClick}
            >
                <Plus className="mr-2 h-4 w-4" />
                Undang Karyawan
            </Button>
        </div>
    );
}
