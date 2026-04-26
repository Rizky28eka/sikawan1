import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    Clock,
    User as UserIcon,
    Fingerprint,
    Shield,
    Edit2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { useState } from "react";
import { User, Department, Site } from "./Partials/types";
import { getStatusBadge } from "./Partials/EmployeeBadge";
import { cn } from "@/lib/utils";
import EditModal from "./Partials/Modals/EditModal";

interface AttendanceRecord {
    id: string;
    timestamp: string;
    type: "IN" | "OUT";
    status: string;
    is_late: boolean;
    confidence?: number;
    site?: { id: string; name: string };
}

interface Props {
    employee: User;
    attendances: AttendanceRecord[];
    auth_user: any;
    departments: Department[];
    sites: Site[];
    shifts: any[];
    managers: any[];
}

export default function EmployeeShow({
    employee,
    attendances,
    auth_user,
    departments,
    sites,
    shifts,
    managers,
}: Props) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Detail Karyawan - ${employee.full_name}`} />

            <div className="mx-auto w-full max-w-5xl space-y-4 px-3 py-6 sm:space-y-6 sm:px-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="ghost" asChild className="-ml-2 w-fit">
                        <Link href={route("employees")}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                    <Button
                        onClick={() => setIsEditModalOpen(true)}
                        className="w-full gap-2 sm:w-auto"
                    >
                        <Edit2 className="h-4 w-4" />
                        Edit Profil
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <Avatar className="mx-auto h-24 w-24 border-2 border-primary/10">
                                    {employee.face_biometric?.image_path ? (
                                        <AvatarImage
                                            src={`/storage/${employee.face_biometric.image_path}`}
                                        />
                                    ) : (
                                        <AvatarFallback className="text-2xl">
                                            {employee.full_name.charAt(0)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="mt-4 space-y-1">
                                    <h1 className="text-xl font-bold">
                                        {employee.full_name}
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        {employee.position || "Karyawan"}
                                    </p>
                                    <div className="pt-2">
                                        {getStatusBadge(employee.status)}
                                    </div>
                                </div>
                            </CardContent>
                            <Separator />
                            <CardContent className="space-y-4 pt-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <span>ID: {employee.employee_id}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">
                                        {employee.personal_email}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {employee.personal_phone || "-"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold">
                                    Penempatan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Departemen
                                    </p>
                                    <p className="text-sm font-medium">
                                        {employee.department?.name || "-"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Lokasi Kerja
                                    </p>
                                    <p className="text-sm font-medium">
                                        {employee.site?.name || "-"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Manager
                                    </p>
                                    <p className="text-sm font-medium">
                                        {employee.direct_manager?.full_name ||
                                            "-"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Attendance & Schedule */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Work Schedule Summary */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Jadwal Kerja ({employee.shift?.name || "-"})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                    <div className="text-center flex-1 border-r">
                                        <p className="text-xs text-muted-foreground">
                                            Jam Masuk
                                        </p>
                                        <p className="font-mono font-bold text-primary">
                                            {employee.shift?.start_time?.slice(
                                                0,
                                                5,
                                            ) || "--:--"}
                                        </p>
                                    </div>
                                    <div className="text-center flex-1">
                                        <p className="text-xs text-muted-foreground">
                                            Jam Pulang
                                        </p>
                                        <p className="font-mono font-bold text-primary">
                                            {employee.shift?.end_time?.slice(
                                                0,
                                                5,
                                            ) || "--:--"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Attendance */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-sm font-semibold">
                                    Presensi Terakhir
                                </CardTitle>
                                <Badge
                                    variant="outline"
                                    className="text-[10px]"
                                >
                                    {attendances.length} Log
                                </Badge>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-[10px] uppercase">
                                                Waktu
                                            </TableHead>
                                            <TableHead className="text-[10px] uppercase text-center">
                                                Tipe
                                            </TableHead>
                                            <TableHead className="text-[10px] uppercase">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendances.length > 0 ? (
                                            attendances
                                                .slice(0, 10)
                                                .map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="py-3">
                                                            <p className="text-sm font-medium">
                                                                {formatTime(
                                                                    item.timestamp,
                                                                )}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground">
                                                                {formatDate(
                                                                    item.timestamp,
                                                                )}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge
                                                                variant="secondary"
                                                                className={cn(
                                                                    "text-[9px] h-5",
                                                                    item.type ===
                                                                        "IN"
                                                                        ? "bg-blue-50 text-blue-600"
                                                                        : "bg-orange-50 text-orange-600",
                                                                )}
                                                            >
                                                                {item.type}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.is_late ? (
                                                                <span className="text-[10px] text-rose-600 font-medium">
                                                                    Terlambat
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] text-emerald-600 font-medium">
                                                                    Tepat Waktu
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={3}
                                                    className="h-24 text-center text-xs text-muted-foreground"
                                                >
                                                    Belum ada data presensi.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <EditModal
                isOpen={isEditModalOpen}
                onClose={setIsEditModalOpen}
                user={employee}
                departments={departments}
                sites={sites}
                shifts={shifts}
                managers={managers}
                authUser={auth_user}
            />
        </AuthenticatedLayout>
    );
}
