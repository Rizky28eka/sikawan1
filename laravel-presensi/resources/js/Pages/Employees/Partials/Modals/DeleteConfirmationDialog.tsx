import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { User } from "../types";

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    onClose: (val: boolean) => void;
    user: User | null;
}

export default function DeleteConfirmationDialog({
    isOpen,
    onClose,
    user,
}: DeleteConfirmationDialogProps) {
    const handleDelete = () => {
        if (!user) return;
        router.delete(route("employees.destroy", user.id), {
            onSuccess: () => {
                onClose(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md w-[95vw]">
                <DialogHeader>
                    <DialogTitle>Hapus Akses Karyawan</DialogTitle>
                    <DialogDescription>
                        Tindakan ini akan mencabut akses login karyawan dari sistem
                        presensi.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                    <p>Anda yakin ingin menghapus akses karyawan berikut?</p>
                    {user && (
                        <div className="rounded-md border bg-muted p-3 text-sm">
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-xs text-muted-foreground">
                                {user.personal_email}
                            </div>
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Karyawan tidak akan bisa lagi mengakses aplikasi menggunakan
                        akun ini.
                    </p>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onClose(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Hapus Akses
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
