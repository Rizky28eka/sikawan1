import { router, Link } from "@inertiajs/react";
import {
    MoreHorizontal,
    Eye,
    Edit2,
    RotateCcw,
    Trash2,
    Fingerprint,
    MapPin as MapPinIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Card } from "@/Components/ui/card";
import { toast } from "sonner";
import { User } from "./types";
import { getStatusBadge } from "./EmployeeBadge";

interface EmployeeTableProps {
    employees: {
        data: User[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    onViewClick: (user: User) => void;
    onEditClick: (user: User) => void;
    onDeleteClick: (user: User) => void;
    onFaceRegistrationClick: (user: User) => void;
}

export default function EmployeeTable({
    employees,
    onViewClick,
    onEditClick,
    onDeleteClick,
    onFaceRegistrationClick,
}: EmployeeTableProps) {
    return (
        <Card>
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[200px]">Detail</TableHead>
                            <TableHead className="hidden md:table-cell">
                                ID & Jabatan
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Organisasi
                            </TableHead>
                            <TableHead className="hidden sm:table-cell">Wajah</TableHead>
                            <TableHead className="hidden xs:table-cell">Status</TableHead>
                            <TableHead className="text-right">Opsi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.data.length > 0 ? (
                            employees.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
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
                                                <Link
                                                    href={route("employees.show", user.id)}
                                                    className="text-sm font-medium hover:text-primary transition-colors"
                                                >
                                                    {user.full_name}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">
                                                    {user.personal_email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell">
                                        <div className="space-y-1">
                                            <div className="text-xs">
                                                ID: {user.employee_id || "N/A"}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {user.position || "-"}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden lg:table-cell">
                                        <div className="space-y-1">
                                            <div className="text-xs">
                                                {user.department?.name || "-"}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPinIcon className="h-3 w-3" />
                                                {user.site?.name || "-"}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex flex-col gap-1.5 items-start">
                                            {user.face_biometric_count &&
                                            user.face_biometric_count > 0 ? (
                                                <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                                                    <Fingerprint className="h-3.5 w-3.5" />
                                                    <span className="hidden md:inline">Valid</span>
                                                    {user.face_biometric
                                                        ?.requires_re_registration && (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-orange-50 text-orange-600 border-orange-200 text-[9px] h-4 px-1 leading-none uppercase font-medium"
                                                        >
                                                            Update
                                                        </Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                    <Fingerprint className="h-3.5 w-3.5 opacity-40" />
                                                    <span className="hidden md:inline">Belum</span>
                                                </div>
                                            )}

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={`h-7 px-2 text-[10px] font-medium uppercase transition-all ${
                                                    user.face_biometric
                                                        ?.requires_re_registration
                                                        ? "border-orange-300 text-orange-600 hover:bg-orange-50"
                                                        : "border-primary/20 hover:border-primary/50"
                                                }`}
                                                onClick={() =>
                                                    onFaceRegistrationClick(user)
                                                }
                                            >
                                                {user.face_biometric
                                                    ?.requires_re_registration
                                                    ? "Ulang"
                                                    : "Daftar"}
                                            </Button>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden xs:table-cell">
                                        {getStatusBadge(user.status)}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Opsi
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route("employees.show", user.id)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Lihat Detail
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onEditClick(user)}
                                                >
                                                    <Edit2 className="mr-2 h-4 w-4" />
                                                    Edit Profil
                                                </DropdownMenuItem>
                                                {user.face_biometric_count &&
                                                user.face_biometric_count > 0 ? (
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            router.post(
                                                                route(
                                                                    "employees.force-reregistration",
                                                                    user.id,
                                                                ),
                                                                {},
                                                                {
                                                                    onSuccess: () =>
                                                                        toast.success(
                                                                            "Karyawan diwajibkan daftar ulang wajah!",
                                                                        ),
                                                                    onError: () =>
                                                                        toast.error(
                                                                            "Gagal mengaktifkan daftar ulang.",
                                                                        ),
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        <RotateCcw className="mr-2 h-4 w-4" />
                                                        Wajibkan Update Wajah
                                                    </DropdownMenuItem>
                                                ) : null}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() =>
                                                        onDeleteClick(user)
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus Akses
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-40 text-center text-sm text-muted-foreground"
                                >
                                    Tidak ada data karyawan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground sm:flex-row">
                <div>
                    Halaman {employees.current_page} dari {employees.last_page}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                    {employees.links.map((link, i) => (
                        <Button
                            key={i}
                            variant={link.active ? "default" : "outline"}
                            size="sm"
                            disabled={!link.url}
                            onClick={() =>
                                link.url &&
                                router.get(
                                    link.url,
                                    {},
                                    { preserveState: true },
                                )
                            }
                            dangerouslySetInnerHTML={{
                                __html: link.label,
                            }}
                        />
                    ))}
                </div>
            </div>
        </Card>
    );
}
