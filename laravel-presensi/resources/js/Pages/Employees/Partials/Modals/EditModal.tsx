import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import { toast } from "sonner";
import { User, Department, Site } from "../types";

interface EditModalProps {
    isOpen: boolean;
    onClose: (val: boolean) => void;
    user: User | null;
    departments: Department[];
    sites: Site[];
    shifts: any[];
    managers: any[];
    authUser: any;
}

export default function EditModal({
    isOpen,
    onClose,
    user,
    departments,
    sites,
    shifts,
    managers,
    authUser,
}: EditModalProps) {
    const { data, setData, put, processing, reset } = useForm({
        full_name: "",
        personal_email: "",
        personal_phone: "",
        role: "",
        department_id: "",
        direct_manager_id: "",
        shift_id: "",
        site_id: "",
        position: "",
        employment_type: "",
        status: "active" as any,
        emergency_contact_name: "",
        emergency_contact_phone: "",
    });

    useEffect(() => {
        if (user) {
            let statusVal = user.status;
            if (typeof statusVal === "boolean") {
                statusVal = statusVal ? "active" : "inactive";
            }

            setData({
                full_name: user.full_name,
                personal_email: user.personal_email,
                personal_phone: user.personal_phone || "",
                role: user.role,
                department_id: user.department_id || user.department?.id || "",
                direct_manager_id:
                    user.direct_manager_id ||
                    (user as any).direct_manager?.id ||
                    "",
                shift_id: user.shift_id || user.shift?.id || "",
                site_id: user.site_id || user.site?.id || "",
                position: user.position || "",
                employment_type: user.employment_type || "",
                status: statusVal as any,
                emergency_contact_name: user.emergency_contact_name || "",
                emergency_contact_phone: user.emergency_contact_phone || "",
            });
        }
    }, [user]);

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        put(route("employees.update", user.id), {
            onSuccess: () => {
                onClose(false);
                toast.success("Data karyawan berhasil diperbarui");
            },
            onError: () => {
                toast.error("Gagal memperbarui data karyawan");
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profil Karyawan</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi dasar dan status kepegawaian.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitEdit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>
                            Nama Lengkap <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={data.full_name}
                            onChange={(e) =>
                                setData("full_name", e.target.value)
                            }
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>
                                Departemen{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.department_id}
                                onValueChange={(v) =>
                                    setData("department_id", v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih departemen" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((d) => (
                                        <SelectItem key={d.id} value={d.id}>
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>
                                Manager Langsung{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.direct_manager_id}
                                onValueChange={(v) =>
                                    setData("direct_manager_id", v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih manager" />
                                </SelectTrigger>
                                <SelectContent>
                                    {managers.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>
                                            {m.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>
                                Shift Kerja{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.shift_id}
                                onValueChange={(v) => setData("shift_id", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Assign shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shifts.map((sh) => (
                                        <SelectItem key={sh.id} value={sh.id}>
                                            {sh.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>
                                Lokasi Kerja{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.site_id}
                                onValueChange={(v) => setData("site_id", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih lokasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sites.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>
                                Posisi / Jabatan{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={data.position}
                                placeholder="Misal: Senior Developer"
                                onChange={(e) =>
                                    setData("position", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>
                                Tipe Kepegawaian{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.employment_type}
                                onValueChange={(val) =>
                                    setData("employment_type", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe kepegawaian" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Permanent">
                                        Permanent (Tetap)
                                    </SelectItem>
                                    <SelectItem value="Contract">
                                        Contract (PKWT)
                                    </SelectItem>
                                    <SelectItem value="Internship">
                                        Internship (Magang)
                                    </SelectItem>
                                    <SelectItem value="Probation">
                                        Probation (Percobaan)
                                    </SelectItem>
                                    <SelectItem value="Daily">
                                        Daily (Harian)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>
                                Status Akun{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) =>
                                    setData("status", v as any)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        Aktif
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Nonaktif
                                    </SelectItem>
                                    <SelectItem value="resigned">
                                        Resigned
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>
                                Role Sistem{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.role}
                                onValueChange={(v) => setData("role", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EMPLOYEE">
                                        Staff
                                    </SelectItem>
                                    <SelectItem value="MANAGER">
                                        Manager
                                    </SelectItem>
                                    {authUser.role === "OWNER" && (
                                        <SelectItem value="OWNER">
                                            Owner
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-3">
                        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Kontak Darurat
                        </Label>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs">
                                    Nama Kontak{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={data.emergency_contact_name}
                                    placeholder="Nama keluarga/kerabat"
                                    onChange={(e) =>
                                        setData(
                                            "emergency_contact_name",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">
                                    No. Telepon{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={data.emergency_contact_phone}
                                    placeholder="0812xxxxxxxx"
                                    onChange={(e) =>
                                        setData(
                                            "emergency_contact_phone",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onClose(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
