import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { useEffect } from "react";
import {
    Building,
    Users,
    Laptop,
    Activity,
    CalendarCheck,
    FileCheck,
    Network,
    Clock,
    UserCheck,
    Calendar,
    FileText,
    TrendingUp,
    AlertCircle,
    ChevronRight,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";

interface Stat {
    label: string;
    value: string | number;
    icon: string;
    color?: string;
}

interface Summary {
    present_today?: number;
    late_today?: number;
    leave_today?: number;
    permission_today?: number;
    pending_leave?: number;
    pending_permission?: number;
    pending_overtime?: number;
    // Employee specifically
    shift_name?: string;
    shift_time?: string;
    attendance_status?: string;
    remaining_leave?: number;
    worked_hours?: number;
}

interface AttendanceTrend {
    labels: string[];
    data: number[];
}

interface Props {
    role: "SUPERADMIN" | "OWNER" | "MANAGER" | "EMPLOYEE";
    stats: Stat[];
    summary: Summary;
    attendanceTrend: AttendanceTrend;
}

const iconMap: Record<string, LucideIcon> = {
    Building,
    Users,
    Laptop,
    Activity,
    CalendarCheck,
    FileCheck,
    Network,
    Clock,
    UserCheck,
    Calendar,
    FileText,
};

// Warna per label stat
const statTheme = (label: string) => {
    if (label.includes("Total Karyawan") || label.includes("Anggota Tim"))
        return {
            bar: "bg-blue-500",
            border: "border-blue-100",
            dot: "bg-blue-500",
        };
    if (label.includes("Presensi") || label.includes("Hadir"))
        return {
            bar: "bg-emerald-500",
            border: "border-emerald-100",
            dot: "bg-emerald-500",
        };
    if (label.includes("Terlambat"))
        return {
            bar: "bg-amber-500",
            border: "border-amber-100",
            dot: "bg-amber-500",
        };
    if (label.includes("Approval") || label.includes("Request Aktif"))
        return {
            bar: "bg-violet-500",
            border: "border-violet-100",
            dot: "bg-violet-500",
        };
    return { bar: "bg-primary", border: "border-muted", dot: "bg-primary" };
};

export default function Dashboard({
    role,
    stats,
    summary,
    attendanceTrend,
}: Props) {
    const user = (usePage() as any).props.auth.user;

    // Real-time polling logic
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ["stats", "summary", "attendanceTrend"],
            });
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Selamat pagi";
        if (hour < 18) return "Selamat siang";
        return "Selamat malam";
    };

    const getDelta = (label: string) => {
        switch (label.toLowerCase()) {
            case "kehadiran":
            case "attendance":
                return "+3 vs kemarin";
            case "terlambat":
                return "-1 vs minggu lalu";
            case "hari cuti":
                return "stabil";
            default:
                return "tren normal";
        }
    };

    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const barHeights = [60, 80, 40, 70, 90, 20, 10];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="mx-auto w-full max-w-7xl space-y-8 pb-10">
                {/* ── Header Minimalist ── */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl tracking-tight font-medium">
                            {getGreeting()},{" "}
                            <span className="text-primary/90">
                                {user.full_name}
                            </span>
                        </h1>
                        <p className="text-sm text-muted-foreground font-light">
                            {role === "EMPLOYEE"
                                ? "Cek status kehadiran dan jadwal Anda hari ini."
                                : `Ringkasan operasional ${user.company?.company_name || "perusahaan"}`}
                        </p>
                    </div>
                    <div className="hidden sm:block">
                        <Badge
                            variant="secondary"
                            className="px-3 py-1 font-medium"
                        >
                            {new Date().toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            })}
                        </Badge>
                    </div>
                </div>

                {/* ── Content Based on Role ── */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* LEFT COLUMN: Main Actions & Status */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* ── Primary Action Card (Role Specific) ── */}
                        {role === "EMPLOYEE" ? (
                            <Card className="border-none bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
                                <CardContent className="flex flex-col items-center justify-between gap-6 p-8 sm:flex-row">
                                    <div className="space-y-2 text-center sm:text-left">
                                        <h2 className="text-lg text-white/90 font-medium">
                                            Waktunya Presensi?
                                        </h2>
                                        <p className="text-sm text-white/70 font-light">
                                            Pastikan Anda berada di lokasi site
                                            yang ditentukan.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            size="lg"
                                            variant="secondary"
                                            className="h-14 px-8 shadow-lg font-medium"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    `${role.toLowerCase()}.attendance`,
                                                )}
                                            >
                                                <Clock className="mr-2 h-5 w-5" />{" "}
                                                Absen Sekarang
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {stats.map((stat, i) => {
                                    const Icon = iconMap[stat.icon] || Activity;
                                    const theme = statTheme(stat.label);

                                    // Determine link based on label
                                    let href = "#";
                                    if (
                                        stat.label.includes("Karyawan") ||
                                        stat.label.includes("Anggota")
                                    ) {
                                        href = route(
                                            `${role.toLowerCase()}.employees`,
                                        );
                                    } else if (
                                        stat.label.includes("Presensi") ||
                                        stat.label.includes("Hadir") ||
                                        stat.label.includes("Terlambat")
                                    ) {
                                        href = route(
                                            `${role.toLowerCase()}.attendance`,
                                        );
                                    } else if (
                                        stat.label.includes("Approval") ||
                                        stat.label.includes("Request")
                                    ) {
                                        href = route(
                                            `${role.toLowerCase()}.requests`,
                                        );
                                    }

                                    return (
                                        <Link
                                            key={i}
                                            href={href}
                                            className="block"
                                        >
                                            <Card className="border-none bg-muted/30 shadow-none transition-all hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98]">
                                                <CardContent className="p-5 text-center">
                                                    <div
                                                        className={cn(
                                                            "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm",
                                                            theme.dot.replace(
                                                                "bg-",
                                                                "text-",
                                                            ),
                                                        )}
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                                                        {stat.label}
                                                    </div>
                                                    <div className="text-xl font-medium">
                                                        {stat.value}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── Dynamic Main View ── */}
                        {role !== "EMPLOYEE" ? (
                            <Card className="border-none bg-background shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">
                                        Analisis Kehadiran Tim
                                    </CardTitle>
                                    <CardDescription className="font-light">
                                        Visualisasi tingkat kehadiran 7 hari
                                        terakhir.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex h-32 items-end justify-between gap-2 px-4">
                                        {attendanceTrend.data.map((h, i) => {
                                            const maxVal = Math.max(
                                                ...attendanceTrend.data,
                                                1,
                                            );
                                            const barHeight =
                                                (h / maxVal) * 100;
                                            return (
                                                <div
                                                    key={i}
                                                    className="group relative flex w-full flex-col items-center gap-2"
                                                >
                                                    <div
                                                        className={cn(
                                                            "w-full max-w-[32px] rounded-t-lg transition-all",
                                                            h === 0
                                                                ? "bg-muted"
                                                                : "bg-primary/80 group-hover:bg-primary",
                                                        )}
                                                        style={{
                                                            height: `${Math.max(barHeight, 5)}%`,
                                                        }}
                                                    />
                                                    <span className="text-[10px] text-muted-foreground font-medium">
                                                        {
                                                            attendanceTrend
                                                                .labels[i]
                                                        }
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Card className="border-none bg-muted/40 shadow-none">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Sisa Cuti Tahunan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl text-primary font-medium">
                                            {summary.remaining_leave ?? 0} Hari
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground font-light">
                                            Berlaku hingga akhir tahun ini
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="border-none bg-muted/40 shadow-none">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Jam Kerja Bulan Ini
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-medium">
                                            {summary.worked_hours ?? 0} Jam
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground font-light">
                                            Akumulasi jam kerja efektif
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Secondary Info & Tasks */}
                    <div className="space-y-6">
                        {/* 📝 Task/Alert Section (Minimalist) */}
                        {role !== "EMPLOYEE" && summary && (
                            <div className="space-y-4">
                                <h3 className="text-sm uppercase tracking-widest text-muted-foreground/60 font-medium">
                                    Perlu Tindakan
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between rounded-xl bg-amber-500/10 p-4 transition-colors hover:bg-amber-500/20 shadow-xs border border-amber-500/5">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-amber-500 p-2 text-white">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-amber-900 font-medium">
                                                    Pengajuan Cuti
                                                </p>
                                                <p className="text-xs text-amber-800/70 font-light">
                                                    {summary.pending_leave ?? 0}{" "}
                                                    menunggu
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-amber-700 hover:bg-amber-500/10 font-medium"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    `${role.toLowerCase()}.requests`,
                                                )}
                                            >
                                                Cek
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-indigo-500/10 p-4 transition-colors hover:bg-indigo-500/20 shadow-xs border border-indigo-500/5">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-indigo-500 p-2 text-white">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-indigo-900 font-medium">
                                                    Lembur
                                                </p>
                                                <p className="text-xs text-indigo-800/70 font-light">
                                                    {summary.pending_overtime ??
                                                        0}{" "}
                                                    menunggu
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-indigo-700 hover:bg-indigo-500/10 font-medium"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    `${role.toLowerCase()}.requests`,
                                                )}
                                            >
                                                Cek
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Activity / Personal Status */}
                        <div className="space-y-4">
                            <h3 className="text-sm uppercase tracking-widest text-muted-foreground/60 font-medium">
                                Informasi Hari Ini
                            </h3>
                            <Card className="border-none shadow-sm">
                                <CardContent className="divide-y p-0">
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-medium">
                                                {summary.shift_name ??
                                                    "Regular Shift"}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground font-light">
                                                {summary.shift_time ??
                                                    "08:00 - 17:00"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <UserCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-medium">
                                                Status Kehadiran
                                            </p>
                                            <p className="text-[11px] text-muted-foreground font-light">
                                                {summary.attendance_status ??
                                                    "Belum Absen"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
