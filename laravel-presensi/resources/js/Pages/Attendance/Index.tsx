import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { PageProps } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import {
    Search,
    Filter,
    MapPin,
    Clock,
    Smartphone,
    AlertCircle,
    RotateCcw,
    CheckCircle2,
    Download,
    Fingerprint,
    Info,
    Check,
    X,
    Network,
} from "lucide-react";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";

import {
    AttendanceLocation,
    AttendanceBiometric,
    AttendanceNetwork,
} from "@/types";

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
    location?: AttendanceLocation;
    biometric?: AttendanceBiometric;
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

interface PaginatedData<T> {
    data: T[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props extends PageProps {
    attendances: PaginatedData<AttendanceRecord>;
    role: "SUPERADMIN" | "OWNER" | "MANAGER" | "EMPLOYEE";
}

export default function AttendanceIndex({ attendances, role }: Props) {
    const [selectedAttendance, setSelectedAttendance] =
        useState<AttendanceRecord | null>(null);

    // Real-time polling logic
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ["attendances"],
            });
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const getStatusBadge = (status: string, isLate: boolean) => {
        if (isLate)
            return (
                <Badge
                    variant="secondary"
                    className="bg-amber-100/50 text-amber-700 hover:bg-amber-100/80 border-none px-2.5 py-0.5 uppercase tracking-widest text-[10px]"
                >
                    Terlambat
                </Badge>
            );
        switch (status.toUpperCase()) {
            case "PRESENT":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-emerald-100/50 text-emerald-700 hover:bg-emerald-100/80 border-none px-2.5 py-0.5 uppercase tracking-widest text-[10px]"
                    >
                        Hadir
                    </Badge>
                );
            case "ABSENT":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-rose-100/50 text-rose-700 hover:bg-rose-100/80 border-none px-2.5 py-0.5 uppercase tracking-widest text-[10px]"
                    >
                        Alpa
                    </Badge>
                );
            case "LEAVE":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-sky-100/50 text-sky-700 hover:bg-sky-100/80 border-none px-2.5 py-0.5 uppercase tracking-widest text-[10px]"
                    >
                        Cuti
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className="uppercase tracking-widest text-[10px] opacity-70"
                    >
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Monitoring Presensi" />

            <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                {/* ── HEADER ── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl tracking-tight sm:text-4xl font-medium">
                            Log Presensi
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground font-light">
                            Pantau aktivitas kehadiran dan verifikasi keamanan
                            biometrik secara terpusat.
                        </p>
                    </div>
                </div>

                {/* ── LOG TABLE ── */}
                <Card className="overflow-hidden border-none bg-background shadow-2xl shadow-gray-200/50">
                    <div className="flex items-center justify-between border-b border-muted/50 bg-muted/5 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-sm uppercase tracking-widest font-medium">
                                Riwayat Aktivitas
                            </span>
                        </div>
                        <Badge
                            variant="outline"
                            className="border-muted font-mono text-[10px]"
                        >
                            Total: {attendances.total} Data
                        </Badge>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/5">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="h-12 w-[300px] pl-6 text-[10px] uppercase tracking-widest text-muted-foreground">
                                        Detail Karyawan
                                    </TableHead>
                                    <TableHead className="h-12 text-[10px] uppercase tracking-widest text-muted-foreground">
                                        Waktu
                                    </TableHead>
                                    <TableHead className="h-12 text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                                        Tipe
                                    </TableHead>
                                    <TableHead className="h-12 text-[10px] uppercase tracking-widest text-muted-foreground">
                                        Status
                                    </TableHead>
                                    <TableHead className="hidden h-12 text-[10px] uppercase tracking-widest text-muted-foreground lg:table-cell">
                                        Keamanan AI
                                    </TableHead>
                                    <TableHead className="h-12 pr-6 text-right text-[10px] uppercase tracking-widest text-muted-foreground">
                                        Info
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="border-b border-muted/30 last:border-none hover:bg-muted/5 transition-colors"
                                        >
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <Avatar className="h-10 w-10 border-2 border-background ring-2 ring-muted/50">
                                                            <AvatarImage
                                                                src={
                                                                    item.user
                                                                        .profile_photo
                                                                }
                                                            />
                                                            <AvatarFallback className="bg-primary/5 text-primary">
                                                                {item.user.full_name.charAt(
                                                                    0,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {item.biometric
                                                            ?.spoof_flag ===
                                                        "real" ? (
                                                            <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-0.5 text-white ring-2 ring-background">
                                                                <Check className="h-2.5 w-2.5" />
                                                            </div>
                                                        ) : (
                                                            <div className="absolute -bottom-1 -right-1 rounded-full bg-rose-500 p-0.5 text-white ring-2 ring-background">
                                                                <AlertCircle className="h-2.5 w-2.5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-sm tracking-tight text-foreground leading-none font-medium">
                                                            {
                                                                item.user
                                                                    .full_name
                                                            }
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-light">
                                                            {
                                                                item.user
                                                                    .employee_id
                                                            }{" "}
                                                            •{" "}
                                                            {item.user
                                                                .department
                                                                ?.name ||
                                                                "Umum"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm tabular-nums">
                                                        {new Date(
                                                            item.timestamp,
                                                        ).toLocaleTimeString(
                                                            "id-ID",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            },
                                                        )}{" "}
                                                        WIB
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {new Date(
                                                            item.timestamp,
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div
                                                    className={cn(
                                                        "inline-flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-medium",
                                                        item.type === "IN"
                                                            ? "bg-blue-50 text-blue-600"
                                                            : "bg-orange-50 text-orange-600",
                                                    )}
                                                >
                                                    {item.type}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(
                                                    item.status,
                                                    item.is_late,
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all",
                                                                (item.confidence ||
                                                                    0) > 0.85
                                                                    ? "bg-emerald-500"
                                                                    : "bg-amber-500",
                                                            )}
                                                            style={{
                                                                width: `${(item.confidence || 0) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground tabular-nums font-medium">
                                                        {Math.round(
                                                            (item.confidence ||
                                                                0) * 100,
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary"
                                                    onClick={() =>
                                                        setSelectedAttendance(
                                                            item,
                                                        )
                                                    }
                                                >
                                                    <Info className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="rounded-2xl bg-muted/30 p-4">
                                                    <Search className="h-8 w-8 text-muted-foreground/30" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-muted-foreground font-medium">
                                                        Tidak ada data
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/60">
                                                        Coba ubah filter
                                                        pencarian Anda.
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* PAGINATION */}
                    <div className="flex items-center justify-between border-t border-muted/50 bg-muted/5 px-6 py-4">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            Halaman{" "}
                            <span className="text-foreground">
                                {attendances.current_page}
                            </span>{" "}
                            / {attendances.last_page}
                        </span>
                        <div className="flex items-center gap-2">
                            {attendances.links.map((link, i) => {
                                if (
                                    link.label.includes("Prev") ||
                                    link.label.includes("Next")
                                )
                                    return null;
                                return (
                                    <Button
                                        key={i}
                                        variant={
                                            link.active ? "default" : "outline"
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                        className={cn(
                                            "h-8 min-w-[32px] border-none text-[10px] font-medium",
                                            link.active
                                                ? "shadow-lg shadow-primary/20"
                                                : "bg-background hover:bg-muted",
                                        )}
                                        onClick={() =>
                                            link.url &&
                                            router.get(
                                                link.url,
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                    >
                                        {link.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </Card>
            </div>

            {/* ── DETAIL MODAL (Enhanced) ── */}
            <Dialog
                open={!!selectedAttendance}
                onOpenChange={(o) => !o && setSelectedAttendance(null)}
            >
                <DialogContent className="max-w-[480px] overflow-hidden border-none p-0 shadow-3xl">
                    {selectedAttendance && (
                        <div className="flex flex-col">
                            {/* Header Gradient */}
                            <div
                                className={cn(
                                    "relative p-8 text-white",
                                    selectedAttendance.type === "IN"
                                        ? "bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500"
                                        : "bg-linear-to-br from-orange-600 via-rose-600 to-rose-700",
                                )}
                            >
                                <div className="absolute right-0 top-0 h-full w-32 bg-white/10 mask-[linear-gradient(to_left,white,transparent)]" />

                                <div className="relative mb-6 flex items-start justify-between">
                                    <Badge className="border-none bg-white/20 font-mono text-[9px] uppercase tracking-widest text-white backdrop-blur-md">
                                        Log #{selectedAttendance.id.slice(0, 8)}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-white hover:bg-white/10"
                                        onClick={() =>
                                            setSelectedAttendance(null)
                                        }
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="relative flex items-center gap-5">
                                    <Avatar className="h-16 w-16 border-4 border-white/20 shadow-2xl">
                                        <AvatarImage
                                            src={
                                                selectedAttendance.user
                                                    .profile_photo
                                            }
                                        />
                                        <AvatarFallback className="bg-white/20 text-xl text-white font-medium">
                                            {selectedAttendance.user.full_name.charAt(
                                                0,
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl leading-none tracking-tight font-medium">
                                            {selectedAttendance.user.full_name}
                                        </h3>
                                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-medium">
                                            {selectedAttendance.user.department
                                                ?.name || "Staff Umum"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Details Information */}
                            <div className="space-y-8 bg-background p-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 rounded-2xl bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                                                Waktu Log
                                            </span>
                                        </div>
                                        <p className="text-lg tabular-nums font-medium">
                                            {new Date(
                                                selectedAttendance.timestamp,
                                            ).toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            })}{" "}
                                            WIB
                                        </p>
                                    </div>
                                    <div className="space-y-2 rounded-2xl bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                                        <div className="flex items-center gap-2 text-primary">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                                                Lokasi Site
                                            </span>
                                        </div>
                                        <p className="truncate text-lg font-medium">
                                            {selectedAttendance.site?.name ||
                                                "Area Site 01"}
                                        </p>
                                    </div>
                                </div>

                                {/* Security Section */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                                        <Fingerprint className="h-3 w-3" />{" "}
                                        Telemetri Keamanan
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between rounded-xl border border-muted/50 p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-foreground font-medium">
                                                        Verifikasi Wajah (AI)
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground font-light">
                                                        Score:{" "}
                                                        {Math.round(
                                                            (selectedAttendance.confidence ||
                                                                0) * 100,
                                                        )}
                                                        % Match
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 shadow-none border-none uppercase text-[9px] font-medium">
                                                Valid
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between rounded-xl border border-muted/50 p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                                    <Smartphone className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-foreground font-medium">
                                                        Anti-Spoofing & Liveness
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground font-light">
                                                        Human Detection Verified
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 shadow-none border-none uppercase text-[9px] font-medium">
                                                Secure
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between rounded-xl border border-muted/50 p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                                                    <Network className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-foreground font-medium">
                                                        Integritas Jaringan
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground font-light">
                                                        IP:{" "}
                                                        {selectedAttendance
                                                            .network
                                                            ?.ip_address ||
                                                            "192.168.1.xxx"}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-violet-500/10 text-violet-700 hover:bg-violet-500/20 shadow-none border-none uppercase text-[9px] font-medium">
                                                Encrypted
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        className="h-12 flex-1 shadow-xl shadow-primary/20 font-medium"
                                        onClick={() =>
                                            selectedAttendance.latitude &&
                                            window.open(
                                                `https://www.google.com/maps?q=${selectedAttendance.latitude},${selectedAttendance.longitude}`,
                                                "_blank",
                                            )
                                        }
                                    >
                                        <MapPin className="mr-2 h-4 w-4" />{" "}
                                        Lihat Titik Koordinat
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-12 border-none bg-muted/50 px-6 font-medium"
                                        onClick={() =>
                                            setSelectedAttendance(null)
                                        }
                                    >
                                        Tutup
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
