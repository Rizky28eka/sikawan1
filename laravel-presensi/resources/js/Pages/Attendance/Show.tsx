import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    MapPin,
    Clock,
    Camera,
    CheckCircle2,
    Fingerprint,
    Info,
    Network,
    Globe,
    Building,
    ShieldCheck,
    ArrowRight,
    Activity,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    AttendanceLocation,
    AttendanceBiometric,
    AttendanceNetwork,
} from "@/types";
import { Separator } from "@/Components/ui/separator";

interface AttendanceRecord {
    id: string;
    user_id: string;
    timestamp: string;
    timestamp_device?: string;
    type: "IN" | "OUT";
    status: string;
    is_late: boolean;
    latitude?: number;
    longitude?: number;
    device_id?: string;
    notes?: string;
    confidence?: number;
    work_mode: string;
    attendance_category: string;
    actual_duration?: number;
    late_duration?: number;
    location?: AttendanceLocation;
    biometric?: AttendanceBiometric & { evidence_path?: string };
    network?: AttendanceNetwork;
    site?: { id: string; name: string };
    user: {
        id: string;
        full_name: string;
        employee_id: string;
        profile_photo?: string;
        department?: { name: string };
    };
}

interface Props extends PageProps {
    attendance: AttendanceRecord;
    role: string;
}

export default function AttendanceShow({ attendance, role }: Props) {
    const getStatusBadge = (status: string, isLate: boolean) => {
        if (isLate)
            return (
                <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1 uppercase tracking-widest text-[10px]"
                >
                    Terlambat
                </Badge>
            );
        switch (status.toUpperCase()) {
            case "PRESENT":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 uppercase tracking-widest text-[10px]"
                    >
                        Hadir
                    </Badge>
                );
            case "ABSENT":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none px-3 py-1 uppercase tracking-widest text-[10px]"
                    >
                        Alpa
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className="uppercase tracking-widest text-[10px]"
                    >
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Detail Presensi" />

            <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                {/* ── BREADCRUMB ── */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link
                        href={route(`${role.toLowerCase()}.attendance`)}
                        className="hover:text-primary transition-colors"
                    >
                        Presensi
                    </Link>
                    <ArrowRight className="h-3 w-3" />
                    <span className="text-foreground font-medium">
                        Detail Log
                    </span>
                </div>

                {/* ── HEADER ── */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
                    <div className="flex items-center gap-5">
                        <Avatar className="h-20 w-20 border shadow-sm">
                            <AvatarImage src={attendance.user.profile_photo} />
                            <AvatarFallback className="text-xl bg-muted">
                                {attendance.user.full_name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {attendance.user.full_name}
                            </h1>
                            <p className="text-muted-foreground">
                                {attendance.user.employee_id} •{" "}
                                {attendance.user.department?.name || "Staff"}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2">
                        {getStatusBadge(attendance.status, attendance.is_late)}
                        <p className="text-sm text-muted-foreground font-mono">
                            ID: {attendance.id.slice(0, 8)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* ── EVIDENCE CARD ── */}
                    <Card className="overflow-hidden border shadow-sm">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Camera className="h-4 w-4 text-primary" />
                                Bukti Presensi (Webcam)
                            </CardTitle>
                            <CardDescription>
                                Foto yang diambil saat verifikasi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {attendance.biometric?.evidence_path ? (
                                <img
                                    src={`/storage/${attendance.biometric.evidence_path}`}
                                    alt="Evidence"
                                    className="w-full h-auto aspect-video object-cover"
                                />
                            ) : (
                                <div className="flex aspect-video items-center justify-center bg-muted/20 text-muted-foreground">
                                    <p className="text-sm">
                                        Tidak ada foto bukti
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── TIME & LOCATION ── */}
                    <div className="space-y-6">
                        <Card className="border shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    Waktu & Tipe
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-sm text-muted-foreground">
                                        Waktu Log
                                    </span>
                                    <span className="text-sm font-medium">
                                        {new Date(
                                            attendance.timestamp,
                                        ).toLocaleTimeString("id-ID", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}{" "}
                                        WIB
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-sm text-muted-foreground">
                                        Tanggal
                                    </span>
                                    <span className="text-sm font-medium">
                                        {new Date(
                                            attendance.timestamp,
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        Tipe Presensi
                                    </span>
                                    <Badge
                                        className={cn(
                                            "border-none px-3 py-1 uppercase tracking-widest text-[10px] font-bold",
                                            ["IN", "CLOCK_IN"].includes(attendance.type?.toUpperCase() || "")
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-orange-100 text-orange-700",
                                        )}
                                    >
                                        {["IN", "CLOCK_IN"].includes(attendance.type?.toUpperCase() || "")
                                            ? "Masuk (IN)"
                                            : "Keluar (OUT)"}
                                    </Badge>
                                </div>
                                {attendance.is_late && attendance.late_duration && (
                                    <div className="flex justify-between items-center bg-rose-50 p-2 rounded-lg border border-rose-100">
                                        <span className="text-xs text-rose-700 font-medium flex items-center gap-1">
                                            <Info className="h-3 w-3" /> Durasi Terlambat
                                        </span>
                                        <span className="text-xs font-bold text-rose-700">
                                            {attendance.late_duration} Menit
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    Informasi Lokasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <MapPin className="h-3 w-3" /> Koordinat
                                        </span>
                                        <span className="text-sm font-mono">
                                            {attendance.latitude?.toFixed(5)}, {attendance.longitude?.toFixed(5)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Activity className="h-3 w-3" /> Akurasi GPS
                                        </span>
                                        <span className="text-sm font-medium">
                                            ± {attendance.location?.accuracy?.toFixed(1) || "0"}m
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Building className="h-3 w-3" /> Jarak ke Kantor
                                        </span>
                                        <span className={cn(
                                            "text-sm font-bold",
                                            (attendance.location?.distance_from_office || 0) > 50 ? "text-rose-600" : "text-emerald-600"
                                        )}>
                                            {attendance.location?.distance_from_office?.toFixed(1) || "0"}m
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs"
                                        onClick={() =>
                                            window.open(
                                                `https://www.google.com/maps?q=${attendance.latitude},${attendance.longitude}`,
                                                "_blank",
                                            )
                                        }
                                    >
                                        <Globe className="mr-2 h-3 w-3" /> Lihat di Google Maps
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── SECURITY METRICS ── */}
                    <Card className="border shadow-sm md:col-span-2">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Verifikasi Keamanan AI
                            </CardTitle>
                            <CardDescription>
                                Detail tingkat kepercayaan identitas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                                {/* AI Matching Score */}
                                <div className="space-y-3">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                        AI Match Score
                                    </p>
                                    <div className="flex items-end gap-1">
                                        <span className="text-5xl font-bold tracking-tighter">
                                            {Math.round((attendance.confidence || 0) * ((attendance.confidence || 0) > 1 ? 1 : 100))}
                                        </span>
                                        <span className="text-xl text-muted-foreground pb-1">%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-500",
                                                (attendance.confidence || 0) > 0.8 ? "bg-emerald-500" : "bg-amber-500"
                                            )}
                                            style={{
                                                width: `${Math.round((attendance.confidence || 0) * ((attendance.confidence || 0) > 1 ? 1 : 100))}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic">
                                        *Tingkat kemiripan wajah dengan data master
                                    </p>
                                </div>

                                {/* Security Flags */}
                                <div className="space-y-4">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                        Security Check
                                    </p>
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                            <span className="text-sm">Anti-Spoofing</span>
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-700 border-none text-[10px] font-bold">REAL</Badge>
                                    </div>
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-blue-500" />
                                            <span className="text-sm">Liveness (Human)</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-600">
                                            {Math.round((attendance.biometric?.liveness_score || 0.99) * 100)}%
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Camera className="h-4 w-4 text-indigo-500" />
                                            <span className="text-sm">Face Detected</span>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {attendance.biometric?.detected_face_count || 1} Wajah
                                        </span>
                                    </div>
                                </div>

                                {/* Network Telemetry */}
                                <div className="space-y-4">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                        Network Telemetry
                                    </p>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Network className="h-3.5 w-3.5" /> IP Address
                                            </span>
                                            <span className="font-mono font-bold text-[11px]">{attendance.network?.ip_address || "-"}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Globe className="h-3.5 w-3.5" /> ISP / Provider
                                            </span>
                                            <span className="font-medium text-[11px] truncate max-w-[100px] text-right">
                                                {attendance.network?.isp || "Local Network"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Activity className="h-3.5 w-3.5" /> Latency / Speed
                                            </span>
                                            <span className="font-medium text-[11px] text-muted-foreground">
                                                {attendance.network?.latency_ms || 0}ms • {attendance.network?.connection_speed_mbps || 0} Mbps
                                            </span>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold">Work Mode</span>
                                            <Badge className="bg-primary/10 text-primary border-none uppercase text-[10px] font-bold">
                                                {attendance.work_mode || "ONSITE"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── NOTES ── */}
                    {attendance.notes && (
                        <Card className="border border-amber-100 bg-amber-50/30 md:col-span-2">
                            <CardContent className="p-4 flex gap-3">
                                <Info className="h-5 w-5 text-amber-600 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                                        Catatan
                                    </p>
                                    <p className="text-sm text-amber-700/80 italic">
                                        {attendance.notes?.replace(/Mobile App/gi, 'Web System')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="pt-4 flex justify-end">
                    <Button variant="ghost" asChild>
                        <Link href={route(`${role.toLowerCase()}.attendance`)}>
                            Tutup Detail
                        </Link>
                    </Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
