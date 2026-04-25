import { useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { Separator } from "@/Components/ui/separator";
import { toast } from "sonner";
import { Department, Site } from "../types";

interface InviteModalProps {
    isOpen: boolean;
    onClose: (val: boolean) => void;
    departments: Department[];
    sites: Site[];
    shifts: any[];
    managers: any[];
    authUser: any;
}

export default function InviteModal({
    isOpen,
    onClose,
    departments,
    sites,
    shifts,
    managers,
    authUser,
}: InviteModalProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        email: "",
        role: "EMPLOYEE",
        department_id:
            authUser.role === "MANAGER" ? authUser.department_id : "",
        direct_manager_id: "",
        site_id: "",
        shift_id: "",
        position: "",
        employment_type: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
    });

    const submitInvite = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("employees.invite"), {
            onSuccess: () => {
                onClose(false);
                reset();
                toast.success("Undangan berhasil dibuat");
            },
            onError: () => {
                toast.error("Gagal mengirim undangan");
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Undang Karyawan Baru</DialogTitle>
                    <DialogDescription>
                        Link pendaftaran akan dikirim ke email calon karyawan.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitInvite} className="space-y-4">
                    <div className="space-y-2">
                        <Label>
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="email"
                            value={data.email}
                            placeholder="nama@perusahaan.com"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        {errors.email && (
                            <span className="text-xs text-red-500">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>
                                Departemen{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.department_id}
                                onValueChange={(val) =>
                                    setData("department_id", val)
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
                            {errors.department_id && (
                                <span className="text-xs text-red-500">
                                    {errors.department_id}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>
                                Shift Kerja{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.shift_id}
                                onValueChange={(val) =>
                                    setData("shift_id", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih shift" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shifts.map((sh) => (
                                        <SelectItem key={sh.id} value={sh.id}>
                                            {sh.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.shift_id && (
                                <span className="text-xs text-red-500">
                                    {errors.shift_id}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>
                                Lokasi Kerja{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.site_id}
                                onValueChange={(val) => setData("site_id", val)}
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
                            {errors.site_id && (
                                <span className="text-xs text-red-500">
                                    {errors.site_id}
                                </span>
                            )}
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
                                onValueChange={(val) =>
                                    setData("direct_manager_id", val)
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
                            {errors.direct_manager_id && (
                                <span className="text-xs text-red-500">
                                    {errors.direct_manager_id}
                                </span>
                            )}
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
                            {errors.position && (
                                <span className="text-xs text-red-500">
                                    {errors.position}
                                </span>
                            )}
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
                            {errors.employment_type && (
                                <span className="text-xs text-red-500">
                                    {errors.employment_type}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Role Sistem <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={data.role}
                            onValueChange={(val) => setData("role", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EMPLOYEE">Staff</SelectItem>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <span className="text-xs text-red-500">
                                {errors.role}
                            </span>
                        )}
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
                                {errors.emergency_contact_name && (
                                    <span className="text-xs text-red-500">
                                        {errors.emergency_contact_name}
                                    </span>
                                )}
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
                                {errors.emergency_contact_phone && (
                                    <span className="text-xs text-red-500">
                                        {errors.emergency_contact_phone}
                                    </span>
                                )}
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
                            {processing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Kirim Undangan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
