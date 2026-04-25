import {
    MoreHorizontal,
    Eye,
    Edit2,
    RotateCcw,
    Trash2,
    Fingerprint,
    MapPin as MapPinIcon,
    Briefcase as BriefcaseIcon,
    Mail,
    Phone,
    Clock,
    Info,
    Check,
    X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Separator } from "@/Components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { toast } from "sonner";
import { User } from "../types";
import { getStatusBadge } from "../EmployeeBadge";

interface ViewModalProps {
    isOpen: boolean;
    onClose: (val: boolean) => void;
    user: User | null;
    onEditClick: (user: User) => void;
}

export default function ViewModal({
    isOpen,
    onClose,
    user,
    onEditClick,
}: ViewModalProps) {
    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Karyawan</DialogTitle>
                    <DialogDescription>
                        Informasi profil, kontak, dan penempatan kerja.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Basic info */}
                    <div className="flex flex-col items-start gap-4 sm:flex-row">
                        <Avatar className="h-16 w-16">
                            {user.face_biometric?.image_path ? (
                                <AvatarImage
                                    src={`/storage/${user.face_biometric.image_path}`}
                                />
                            ) : (
                                <AvatarFallback>
                                    {user.full_name.charAt(0)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="space-y-1">
                            <div className="text-lg font-medium">
                                {user.full_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {user.position || "-"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                ID: {user.employee_id || "N/A"}
                            </div>
                            <div className="mt-2">
                                {getStatusBadge(user.status)}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Professional info */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <BriefcaseIcon className="h-4 w-4" />
                            Informasi Profesional
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-sm">Jabatan</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 text-sm">
                                    {user.position || "-"}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-sm">
                                        Tanggal Bergabung
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 text-sm">
                                    {new Date(user.join_date).toLocaleDateString(
                                        "id-ID",
                                        {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        },
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-sm">
                                        Tipe Kepegawaian
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 text-sm">
                                    {user.employment_type || "-"}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-sm">
                                        Manager Langsung
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 text-sm">
                                    {user.direct_manager?.full_name ||
                                        "Belum ditentukan"}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-sm">
                                        Role Akses
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 text-sm">
                                    {user.role}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-sm">
                                        Login Terakhir
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 text-sm text-muted-foreground">
                                    {user.last_login
                                        ? new Date(user.last_login).toLocaleString(
                                              "id-ID",
                                          )
                                        : "Belum pernah login"}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Mail className="h-4 w-4" />
                            Kontak
                        </div>
                        <div className="space-y-3">
                            <Card>
                                <CardContent className="flex items-center justify-between gap-3 py-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {user.personal_email}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                user.personal_email,
                                            );
                                            toast.success("Email disalin");
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex items-center gap-3 py-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {user.personal_phone || "Belum diisi"}
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <MapPinIcon className="h-4 w-4" />
                            Penempatan
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-sm">
                                        Departemen
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 text-sm">
                                    {user.department?.name || "-"}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="py-3">
                                    <CardTitle className="text-sm">
                                        Site / Lokasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 text-sm">
                                    {user.site?.name || "-"}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="py-2 px-4">
                                    <CardTitle className="text-[10px] uppercase text-muted-foreground">
                                        Kontak Darurat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-3 px-4 flex flex-col gap-1">
                                    <div className="text-sm font-medium">
                                        {user.emergency_contact_name || "-"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {user.emergency_contact_phone || "-"}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Shift & schedule */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Clock className="h-4 w-4" />
                            Shift & Jadwal
                        </div>
                        <Card>
                            <CardContent className="space-y-2 py-3 text-sm">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        Shift: {user.shift?.name || "Belum diatur"}
                                    </div>
                                    {user.shift && (
                                        <div className="text-muted-foreground">
                                            {user.shift.base_clock_in?.slice(0, 5)}{" "}
                                            -{" "}
                                            {user.shift.base_clock_out?.slice(0, 5)}
                                        </div>
                                    )}
                                </div>
                                {user.work_schedules && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Info className="h-3 w-3" />
                                            Jadwal harian diringkas sebagai hari
                                            kerja / libur.
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "M",
                                                "S",
                                                "S",
                                                "R",
                                                "K",
                                                "J",
                                                "S",
                                            ].map((d, idx) => {
                                                const schedule =
                                                    user.work_schedules?.find(
                                                        (s) =>
                                                            s.day_of_week ===
                                                            (idx + 1) % 7,
                                                    );
                                                const isWork =
                                                    schedule?.is_working_day ??
                                                    false;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-1 text-xs"
                                                    >
                                                        <span>{d}</span>
                                                        {isWork ? (
                                                            <Check className="h-3 w-3" />
                                                        ) : (
                                                            <X className="h-3 w-3" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Face info */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <span>Status akun:</span>
                            {getStatusBadge(user.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span>Wajah:</span>
                            {user.face_biometric_count &&
                            user.face_biometric_count > 0 ? (
                                <Badge variant="default">Terdaftar</Badge>
                            ) : (
                                <Badge variant="outline">Belum ada</Badge>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                            className="flex-1"
                            onClick={() => onEditClick(user)}
                        >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit Profil
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onClose(false)}
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper component for copying email
const Copy = ({ className, ...props }: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);
