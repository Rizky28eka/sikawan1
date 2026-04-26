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
import { 
    User as UserIcon, 
    Mail, 
    Phone, 
    Briefcase, 
    Building2, 
    MapPin, 
    Clock, 
    ShieldCheck, 
    UserCheck,
    AlertCircle,
    Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    const { data, setData, put, processing, reset, errors } = useForm({
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
            onError: (err) => {
                console.error(err);
                toast.error("Gagal memperbarui data karyawan. Periksa kembali form.");
            },
        });
    };

    const isEditable = (field: string) => {
        if (authUser.role === "SUPERADMIN") return true;
        if (authUser.id === user?.id) return true;
        
        // Fields managers can't edit
        const restricted = ["full_name", "personal_email", "personal_phone"];
        return !restricted.includes(field);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <UserIcon className="h-5 w-5 text-primary" />
                        Edit Profil Karyawan
                    </DialogTitle>
                    <DialogDescription>
                        Perbarui informasi dasar, jabatan, dan status kepegawaian.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitEdit} className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
                    {/* Section: Identitas Dasar */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                            <Smartphone className="h-4 w-4" />
                            Identitas Dasar
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Nama Lengkap <span className="text-destructive">*</span></Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        disabled={!isEditable("full_name")}
                                        value={data.full_name}
                                        onChange={(e) => setData("full_name", e.target.value)}
                                        className={cn("pl-9", errors.full_name && "border-destructive ring-destructive")}
                                        placeholder="Nama Lengkap"
                                    />
                                </div>
                                {errors.full_name && <p className="text-[10px] text-destructive flex items-center gap-1 mt-1 font-medium"><AlertCircle className="h-3 w-3" /> {errors.full_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Email <span className="text-destructive">*</span></Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        disabled={!isEditable("personal_email")}
                                        value={data.personal_email}
                                        onChange={(e) => setData("personal_email", e.target.value)}
                                        className={cn("pl-9", errors.personal_email && "border-destructive ring-destructive")}
                                        placeholder="example@email.com"
                                    />
                                </div>
                                {errors.personal_email && <p className="text-[10px] text-destructive flex items-center gap-1 mt-1 font-medium"><AlertCircle className="h-3 w-3" /> {errors.personal_email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium">No. Telepon</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        disabled={!isEditable("personal_phone")}
                                        value={data.personal_phone}
                                        onChange={(e) => setData("personal_phone", e.target.value)}
                                        className="pl-9"
                                        placeholder="0812xxxxxx"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Section: Organisasi & Jabatan */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                            <Briefcase className="h-4 w-4" />
                            Organisasi & Jabatan
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Departemen <span className="text-destructive">*</span></Label>
                                <Select value={data.department_id} onValueChange={(v) => setData("department_id", v)}>
                                    <SelectTrigger className={cn(errors.department_id && "border-destructive")}>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Pilih Departemen" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.department_id && <p className="text-[10px] text-destructive font-medium">{errors.department_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Lokasi Kerja <span className="text-destructive">*</span></Label>
                                <Select value={data.site_id} onValueChange={(v) => setData("site_id", v)}>
                                    <SelectTrigger className={cn(errors.site_id && "border-destructive")}>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Pilih Lokasi" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sites.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.site_id && <p className="text-[10px] text-destructive font-medium">{errors.site_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Manager Langsung <span className="text-destructive">*</span></Label>
                                <Select value={data.direct_manager_id} onValueChange={(v) => setData("direct_manager_id", v)}>
                                    <SelectTrigger className={cn(errors.direct_manager_id && "border-destructive")}>
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Pilih Manager" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managers.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.direct_manager_id && <p className="text-[10px] text-destructive font-medium">{errors.direct_manager_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Shift Kerja <span className="text-destructive">*</span></Label>
                                <Select value={data.shift_id} onValueChange={(v) => setData("shift_id", v)}>
                                    <SelectTrigger className={cn(errors.shift_id && "border-destructive")}>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Pilih Shift" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {shifts.map((sh) => <SelectItem key={sh.id} value={sh.id}>{sh.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.shift_id && <p className="text-[10px] text-destructive font-medium">{errors.shift_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Posisi / Jabatan <span className="text-destructive">*</span></Label>
                                <Input
                                    value={data.position}
                                    onChange={(e) => setData("position", e.target.value)}
                                    className={cn(errors.position && "border-destructive")}
                                    placeholder="Misal: Lead Developer"
                                />
                                {errors.position && <p className="text-[10px] text-destructive font-medium">{errors.position}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Tipe Kepegawaian <span className="text-destructive">*</span></Label>
                                <Select value={data.employment_type} onValueChange={(val) => setData("employment_type", val)}>
                                    <SelectTrigger className={cn(errors.employment_type && "border-destructive")}>
                                        <SelectValue placeholder="Pilih Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Permanent">Tetap (Permanent)</SelectItem>
                                        <SelectItem value="Contract">Kontrak (PKWT)</SelectItem>
                                        <SelectItem value="Internship">Magang (Internship)</SelectItem>
                                        <SelectItem value="Probation">Percobaan (Probation)</SelectItem>
                                        <SelectItem value="Daily">Harian (Daily)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.employment_type && <p className="text-[10px] text-destructive font-medium">{errors.employment_type}</p>}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Section: Status & Hak Akses */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                            <ShieldCheck className="h-4 w-4" />
                            Status & Hak Akses
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Status Akun <span className="text-destructive">*</span></Label>
                                <Select value={data.status} onValueChange={(v) => setData("status", v as any)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="inactive">Nonaktif</SelectItem>
                                        <SelectItem value="resigned">Resigned</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Role Sistem <span className="text-destructive">*</span></Label>
                                <Select value={data.role} onValueChange={(v) => setData("role", v)}>
                                    <SelectTrigger className={cn(errors.role && "border-destructive")}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EMPLOYEE">Staff (Employee)</SelectItem>
                                        <SelectItem value="MANAGER">Manager</SelectItem>
                                        {authUser.role === "OWNER" && <SelectItem value="OWNER">Owner</SelectItem>}
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-[10px] text-destructive font-medium">{errors.role}</p>}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Section: Kontak Darurat */}
                    <div className="space-y-4 pb-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                            <Phone className="h-4 w-4" />
                            Kontak Darurat
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Nama Kontak Darurat <span className="text-destructive">*</span></Label>
                                <Input
                                    value={data.emergency_contact_name}
                                    onChange={(e) => setData("emergency_contact_name", e.target.value)}
                                    className={cn(errors.emergency_contact_name && "border-destructive")}
                                    placeholder="Nama keluarga/kerabat"
                                />
                                {errors.emergency_contact_name && <p className="text-[10px] text-destructive font-medium">{errors.emergency_contact_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium">No. Telepon Darurat <span className="text-destructive">*</span></Label>
                                <Input
                                    value={data.emergency_contact_phone}
                                    onChange={(e) => setData("emergency_contact_phone", e.target.value)}
                                    className={cn(errors.emergency_contact_phone && "border-destructive")}
                                    placeholder="0812xxxxxx"
                                />
                                {errors.emergency_contact_phone && <p className="text-[10px] text-destructive font-medium">{errors.emergency_contact_phone}</p>}
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter className="p-6 bg-muted/50 border-t">
                    <Button type="button" variant="ghost" onClick={() => onClose(false)}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={processing} onClick={submitEdit} className="px-8">
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
