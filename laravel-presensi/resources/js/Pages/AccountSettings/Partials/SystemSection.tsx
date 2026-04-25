import { useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import {
    Building,
    Info,
    CalendarClock,
    Fingerprint,
    MapPin,
    Bell,
    Smartphone,
    Zap,
    Save,
    Loader2,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface SystemSectionProps {
    role: string;
    company?: any;
    system_settings?: any;
}

export default function SystemSection({
    role,
    company,
    system_settings,
}: SystemSectionProps) {
    const companyForm = useForm({
        company_name: company?.company_name || "",
        company_email: company?.company_email || "",
        company_phone: company?.company_phone || "",
        company_address: company?.company_address || "",
        working_start: company?.working_start || "08:00",
        working_end: company?.working_end || "17:00",
        timezone: company?.timezone || "Asia/Jakarta",
        late_tolerance: company?.late_tolerance || 0,
        auto_absent: company?.auto_absent || false,
        enable_face_recognition: company?.enable_face_recognition || false,
        enable_geofencing: company?.enable_geofencing || false,
        notify_leave_request: company?.notify_leave_request || false,
        notify_attendance_reminder:
            company?.notify_attendance_reminder || false,
        notify_system_activity: company?.notify_system_activity || false,
    });

    const updateCompany = (e: React.FormEvent) => {
        e.preventDefault();
        companyForm.post(route("account-settings.company.update"), {
            onSuccess: () =>
                toast.success("Seluruh parameter sistem berhasil disimpan"),
        });
    };

    const protocolItems = [
        {
            icon: Fingerprint,
            label: "Face Recognition",
            key: "enable_face_recognition",
            desc: "Aktifkan validasi wajah biometrik",
        },
        {
            icon: MapPin,
            label: "Geofencing",
            key: "enable_geofencing",
            desc: "Batasi presensi berdasarkan lokasi",
        },
        {
            icon: CalendarClock,
            label: "Auto Absence",
            key: "auto_absent",
            desc: "Tandai otomatis ketidakhadiran",
        },
        {
            icon: Bell,
            label: "Notifikasi Cuti",
            key: "notify_leave_request",
            desc: "Kirim notifikasi request izin",
        },
        {
            icon: Smartphone,
            label: "Reminder Presensi",
            key: "notify_attendance_reminder",
            desc: "Pengingat jam masuk/keluar",
        },
        {
            icon: Zap,
            label: "Notifikasi Aktivitas",
            key: "notify_system_activity",
            desc: "Laporan aktivitas sistem",
        },
    ];

    return (
        <div className="space-y-4">
            {role === "OWNER" && company && (
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <Building className="h-5 w-5" /> Konfigurasi
                                    Operasional Bisnis
                                </CardTitle>
                                <CardDescription>
                                    Atur parameter kerja utama untuk perusahaan
                                    Anda.
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                Sistem Aktif
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8">
                        <form onSubmit={updateCompany} className="space-y-8">
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                {/* Profil perusahaan */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                                        <Info className="h-4 w-4" /> Profil
                                        Perusahaan
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Nama Perusahaan</Label>
                                            <Input
                                                value={companyForm.data.company_name}
                                                onChange={(e) =>
                                                    companyForm.setData(
                                                        "company_name",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Nomor Kontak</Label>
                                            <Input
                                                value={companyForm.data.company_phone}
                                                onChange={(e) =>
                                                    companyForm.setData(
                                                        "company_phone",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Alamat Kantor Pusat</Label>
                                            <Textarea
                                                value={companyForm.data.company_address}
                                                onChange={(e) =>
                                                    companyForm.setData(
                                                        "company_address",
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-[90px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Standar kehadiran */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                                        <CalendarClock className="h-4 w-4" />{" "}
                                        Standar Kehadiran
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Jam Masuk</Label>
                                            <Input
                                                type="time"
                                                value={companyForm.data.working_start}
                                                onChange={(e) =>
                                                    companyForm.setData(
                                                        "working_start",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Jam Pulang</Label>
                                            <Input
                                                type="time"
                                                value={companyForm.data.working_end}
                                                onChange={(e) =>
                                                    companyForm.setData(
                                                        "working_end",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>
                                            Toleransi Terlambat (menit)
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={companyForm.data.late_tolerance}
                                                onChange={(e) =>
                                                    companyForm.setData(
                                                        "late_tolerance",
                                                        parseInt(
                                                            e.target.value ||
                                                                "0",
                                                            10,
                                                        ),
                                                    )
                                                }
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                menit
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security & notification switches */}
                            <div className="space-y-4 border-t pt-6">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                                    <Fingerprint className="h-4 w-4" /> Protokol
                                    Keamanan & Notifikasi
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {protocolItems.map((item) => (
                                        <Card
                                            key={item.key}
                                            className="h-full"
                                        >
                                            <CardContent className="flex items-center justify-between gap-3 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                                                        <item.icon className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-xs font-semibold">
                                                            {item.label}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={
                                                        companyForm.data[
                                                            item.key as keyof typeof companyForm.data
                                                        ] as boolean
                                                    }
                                                    onCheckedChange={(v) =>
                                                        companyForm.setData(
                                                            item.key as any,
                                                            v,
                                                        )
                                                    }
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button disabled={companyForm.processing}>
                                    {companyForm.processing && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Pengaturan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {role === "SUPERADMIN" && system_settings && (
                <Card className="border-primary/40 bg-primary/5">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-background text-primary">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-semibold">
                                    Master Platform Core
                                </CardTitle>
                                <CardDescription>
                                    Konfigurasi inti platform hanya dapat diubah
                                    melalui akses admin teknis.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">
                            Untuk perubahan tingkat kernel / infrastruktur,
                            gunakan dokumentasi pengembang dan akses terminal
                            yang telah diautentikasi.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
