import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router, useForm } from "@inertiajs/react";
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Separator } from "@/Components/ui/separator";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    Plus,
    User,
    Users,
    Check,
    Search,
    Calendar,
    ChevronRight,
    FileText,
    X,
    History,
    Clock,
    Filter,
    RotateCcw,
    ChevronLeft,
    Info,
    Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestItem {
    id: string;
    user_id: string;
    full_name: string;
    employee_id: string;
    profile_photo: string | null;
    department_name: string;
    type: "leave" | "overtime" | "permission" | "correction";
    submission_date: string;
    request_date: string;
    end_date: string | null;
    requester_notes: string;
    approver_notes: string | null;
    status: "pending" | "approved" | "rejected";
}

interface LeaveType {
    id: string;
    name: string;
}

interface Props extends PageProps {
    requests: {
        data: RequestItem[];
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    role: string;
    tab: string;
    leaveTypes: LeaveType[];
}

export default function Index({ requests, role, tab, leaveTypes }: Props) {
    const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(
        null,
    );
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [approverNotes, setApproverNotes] = useState("");

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ["requests"] });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const { data, setData, post, processing, reset, errors } = useForm({
        type: "leave" as any,
        leave_type_id: "",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        date: "",
        check_in: "",
        check_out: "",
        permission_type: "",
        reason: "",
    });

    const handleTabChange = (value: string) => {
        router.get(
            route("requests"),
            { tab: value },
            { preserveState: true },
        );
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("requests.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const updateStatus = (
        item: RequestItem,
        newStatus: "approved" | "rejected",
    ) => {
        router.post(
            route("requests.update-status", { type: item.type, id: item.id }),
            { status: newStatus, notes: approverNotes },
            {
                onSuccess: () => {
                    setSelectedRequest(null);
                    setApproverNotes("");
                },
            },
        );
    };

    const deleteRequest = (item: RequestItem) => {
        if (!confirm("Apakah Anda yakin ingin membatalkan pengajuan ini?"))
            return;
        router.delete(
            route("requests.destroy", { type: item.type, id: item.id }),
        );
    };

    const getStatusBadge = (status: string) => {
        const base =
            "text-[9px] sm:text-[10px] uppercase font-medium tracking-tight px-2 py-0";
        switch (status) {
            case "approved":
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            base,
                            "bg-emerald-50 text-emerald-700 border-emerald-200",
                        )}
                    >
                        Disetujui
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            base,
                            "bg-rose-50 text-rose-700 border-rose-200",
                        )}
                    >
                        Ditolak
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            base,
                            "bg-amber-50 text-amber-700 border-amber-200",
                        )}
                    >
                        Menunggu
                    </Badge>
                );
        }
    };

    const getTypeLabel = (type: string) =>
        ({
            leave: "Cuti",
            overtime: "Lembur",
            permission: "Izin",
            correction: "Koreksi",
        })[type] ?? type;

    const formatShortDate = (d: string) =>
        new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Pengajuan" />

            <div className="w-full space-y-4 sm:space-y-6">
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 sm:px-0">
                    <div className="space-y-1">
                        <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                            Pengajuan
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground font-light">
                            Kelola permohonan cuti, izin, lembur, dan koreksi
                            absen.
                        </p>
                    </div>
                    {!["OWNER", "SUPERADMIN"].includes(role) && (
                        <Button
                            size="sm"
                            className="h-9 sm:h-10 px-4 sm:px-6 shadow-lg shadow-primary/20 text-xs font-medium uppercase tracking-wider"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Buat Pengajuan
                        </Button>
                    )}
                </div>

                {/* ── TABS ── */}
                <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="h-10 sm:h-11 p-1 bg-muted/50 border-none w-full sm:w-auto overflow-x-auto justify-start no-scrollbar">
                        {!["OWNER", "SUPERADMIN"].includes(role) && (
                            <TabsTrigger
                                value="my-requests"
                                className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-4 data-[state=active]:bg-background font-medium"
                            >
                                <User className="h-3.5 w-3.5 mr-2" /> Saya
                            </TabsTrigger>
                        )}
                        {["OWNER", "ADMIN", "MANAGER", "SUPERADMIN"].includes(role) && (
                            <>
                                <TabsTrigger
                                    value="team-requests"
                                    className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-4 data-[state=active]:bg-background font-medium"
                                >
                                    <Users className="h-3.5 w-3.5 mr-2" /> Tim
                                </TabsTrigger>
                                <TabsTrigger
                                    value="approvals"
                                    className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-4 data-[state=active]:bg-background font-medium"
                                >
                                    <Inbox className="h-3.5 w-3.5 mr-2" /> Persetujuan
                                </TabsTrigger>
                            </>
                        )}
                        <TabsTrigger
                            value="history"
                            className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-4 data-[state=active]:bg-background font-medium"
                        >
                            <History className="h-3.5 w-3.5 mr-2" /> Riwayat
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* ── TABLE CARD ── */}
                <Card className="border-border/60 shadow-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/5">
                                <TableRow className="hover:bg-transparent border-b border-border/60">
                                    <TableHead className="pl-4 sm:pl-6 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">
                                        Karyawan
                                    </TableHead>
                                    <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12 hidden sm:table-cell">
                                        Kategori
                                    </TableHead>
                                    <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">
                                        Waktu / Status
                                    </TableHead>
                                    <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12 hidden md:table-cell">
                                        Catatan
                                    </TableHead>
                                    <TableHead className="text-right pr-4 sm:pr-6 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">
                                        Detail
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.data.length > 0 ? (
                                    requests.data.map((item) => (
                                        <TableRow
                                            key={`${item.type}-${item.id}`}
                                            className="hover:bg-muted/30 border-b border-border/40 group transition-colors cursor-pointer"
                                            onClick={() =>
                                                setSelectedRequest(item)
                                            }
                                        >
                                            <TableCell className="pl-4 sm:pl-6 py-3 sm:py-4">
                                                <div className="flex items-center gap-2.5 sm:gap-3">
                                                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-border/60 ring-2 ring-transparent group-hover:ring-primary/10 transition-all">
                                                        <AvatarImage
                                                            src={
                                                                item.profile_photo ||
                                                                ""
                                                            }
                                                        />
                                                        <AvatarFallback className="bg-primary/5 text-primary text-[9px] sm:text-[10px] font-medium">
                                                            {item.full_name
                                                                .substring(0, 2)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-0.5">
                                                        <p className="text-xs sm:text-sm font-medium text-foreground leading-none">
                                                            {item.full_name}
                                                        </p>
                                                        <p className="text-[9px] sm:text-[10px] font-medium text-muted-foreground uppercase tracking-tight truncate max-w-[80px] xs:max-w-[120px] sm:max-w-none">
                                                            {item.employee_id} ·{" "}
                                                            {
                                                                item.department_name
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] font-medium border-border/60 bg-background"
                                                >
                                                    {getTypeLabel(item.type)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1.5 flex flex-col items-start">
                                                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium tabular-nums text-foreground">
                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        {formatShortDate(
                                                            item.request_date,
                                                        )}
                                                    </div>
                                                    {getStatusBadge(
                                                        item.status,
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                                    {item.requester_notes ||
                                                        "—"}
                                                </p>
                                            </TableCell>
                                            <TableCell
                                                className="text-right pr-4 sm:pr-6"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-full p-0 hover:bg-primary/5 hover:text-primary"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-48 sm:h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="size-10 sm:size-12 rounded-full bg-muted flex items-center justify-center">
                                                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/40" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-xs sm:text-sm font-medium text-foreground">
                                                        Tidak Ada Pengajuan
                                                    </h4>
                                                    <p className="text-[10px] sm:text-xs text-muted-foreground mx-auto">
                                                        Belum ada rekaman data
                                                        pengajuan di sini.
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/5 flex flex-col xs:flex-row items-center justify-between gap-3">
                        <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                            Halaman{" "}
                            <span className="text-foreground">
                                {requests.current_page}
                            </span>{" "}
                            dari {requests.last_page}
                        </p>
                        <div className="flex items-center gap-1.5">
                            {requests.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={
                                        link.active ? "default" : "outline"
                                    }
                                    size="sm"
                                    disabled={!link.url}
                                    className={cn(
                                        "h-7 min-w-7 px-2 text-[10px] font-medium",
                                        !link.url && "opacity-50",
                                    )}
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
            </div>

            {/* ── CREATE DIALOG (Responsive) ── */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-xl p-0 border-none shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden mt-auto sm:mt-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/5">
                        <DialogTitle className="text-lg font-medium">
                            Buat Pengajuan Baru
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium">
                            Lengkapi data diri dan keterangan pengajuan Anda di
                            bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate}>
                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Jenis Layanan
                                    </Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(v) =>
                                            setData("type", v as any)
                                        }
                                    >
                                        <SelectTrigger className="h-10 text-sm border-border/60">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="leave">
                                                Cuti / Libur
                                            </SelectItem>
                                            <SelectItem value="overtime">
                                                Kerja Lembur
                                            </SelectItem>
                                            <SelectItem value="permission">
                                                Izin / Sakit
                                            </SelectItem>
                                            <SelectItem value="correction">
                                                Koreksi Presensi
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {data.type === "leave" && (
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                            Tipe Cuti
                                        </Label>
                                        <Select
                                            value={data.leave_type_id}
                                            onValueChange={(v) =>
                                                setData("leave_type_id", v)
                                            }
                                        >
                                            <SelectTrigger className="h-10 text-sm border-border/60">
                                                <SelectValue placeholder="Pilih tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {leaveTypes.map((t) => (
                                                    <SelectItem
                                                        key={t.id}
                                                        value={t.id}
                                                    >
                                                        {t.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {data.type === "permission" && (
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                            Kategori Izin
                                        </Label>
                                        <Input
                                            placeholder="Misal: Sakit"
                                            value={data.permission_type}
                                            onChange={(e) =>
                                                setData(
                                                    "permission_type",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-10 text-sm"
                                        />
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-border/60" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.type === "leave" ? (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                Mulai
                                            </Label>
                                            <Input
                                                type="date"
                                                className="h-10 text-sm"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "start_date",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                Selesai
                                            </Label>
                                            <Input
                                                type="date"
                                                className="h-10 text-sm"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_date",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                ) : data.type === "correction" ? (
                                    <div className="sm:col-span-2 space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                Tanggal Absensi
                                            </Label>
                                            <Input
                                                type="date"
                                                className="h-10 text-sm"
                                                value={data.date}
                                                onChange={(e) =>
                                                    setData(
                                                        "date",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                    Koreksi Masuk
                                                </Label>
                                                <Input
                                                    type="time"
                                                    className="h-10 text-sm"
                                                    value={data.check_in}
                                                    onChange={(e) =>
                                                        setData(
                                                            "check_in",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                    Koreksi Pulang
                                                </Label>
                                                <Input
                                                    type="time"
                                                    className="h-10 text-sm"
                                                    value={data.check_out}
                                                    onChange={(e) =>
                                                        setData(
                                                            "check_out",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                Mulai Waktu
                                            </Label>
                                            <Input
                                                type="datetime-local"
                                                className="h-10 text-sm"
                                                value={data.start_time}
                                                onChange={(e) =>
                                                    setData(
                                                        "start_time",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                Selesai Waktu
                                            </Label>
                                            <Input
                                                type="datetime-local"
                                                className="h-10 text-sm"
                                                value={data.end_time}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_time",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Alasan Pengajuan
                                </Label>
                                <Textarea
                                    placeholder="Jelaskan secara detail alasan pengajuan ini..."
                                    value={data.reason}
                                    onChange={(e) =>
                                        setData("reason", e.target.value)
                                    }
                                    className="h-24 sm:h-32 text-sm border-border/60 focus-visible:ring-primary/20 resize-none"
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-border/60 flex items-center justify-end gap-3 bg-muted/5">
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-10 text-xs font-medium uppercase tracking-wider"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="h-10 px-6 text-xs font-medium uppercase tracking-wider shadow-lg shadow-primary/10"
                                disabled={processing}
                            >
                                Kirim Pengajuan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── DETAIL DIALOG ── */}
            <Dialog
                open={!!selectedRequest}
                onOpenChange={(o) => {
                    if (!o) {
                        setSelectedRequest(null);
                        setApproverNotes("");
                    }
                }}
            >
                <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden mt-auto sm:mt-0">
                    {selectedRequest && (
                        <div className="flex flex-col">
                            <div
                                className={cn(
                                    "p-5 sm:p-6 text-white bg-gradient-to-br",
                                    selectedRequest.status === "approved"
                                        ? "from-emerald-600 to-teal-700"
                                        : selectedRequest.status === "rejected"
                                          ? "from-rose-600 to-red-700"
                                          : "from-amber-500 to-orange-600",
                                )}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <Badge className="bg-white/20 border-none text-white text-[9px] font-medium uppercase tracking-widest px-2.5 py-0.5">
                                        Request Token:{" "}
                                        {selectedRequest.id
                                            .split("-")[0]
                                            .toUpperCase()}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-white hover:bg-white/10 rounded-full"
                                        onClick={() => setSelectedRequest(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 border-2 border-white/20">
                                        <AvatarImage
                                            src={
                                                selectedRequest.profile_photo ||
                                                ""
                                            }
                                        />
                                        <AvatarFallback className="bg-white/10 font-medium text-lg">
                                            {selectedRequest.full_name.charAt(
                                                0,
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-0.5">
                                        <h3 className="text-lg font-medium leading-tight">
                                            {selectedRequest.full_name}
                                        </h3>
                                        <p className="text-[10px] text-white/80 font-medium uppercase tracking-wider">
                                            {selectedRequest.employee_id} ·{" "}
                                            {selectedRequest.department_name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                                            Jenis Layanan
                                        </Label>
                                        <p className="text-sm font-medium text-foreground">
                                            {getTypeLabel(selectedRequest.type)}
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <Label className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                                            Tgl Pelaksanaan
                                        </Label>
                                        <p className="text-sm font-medium text-foreground tabular-nums">
                                            {formatShortDate(
                                                selectedRequest.request_date,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5 p-3.5 rounded-xl border border-border/60 bg-muted/20">
                                    <Label className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Catatan Karyawan
                                    </Label>
                                    <p className="text-sm text-foreground leading-relaxed italic">
                                        "
                                        {selectedRequest.requester_notes ||
                                            "Tidak ada catatan."}
                                        "
                                    </p>
                                </div>

                                {selectedRequest.status === "pending" &&
                                    role !== "EMPLOYEE" && (
                                        <div className="space-y-3 pt-2">
                                            <Separator className="bg-border/60" />
                                            <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                Evaluasi Pimpinan
                                            </Label>
                                            <Textarea
                                                placeholder="Tulis alasan penyetujuan atau penolakan..."
                                                className="h-20 text-sm border-border/60 resize-none bg-muted/5 focus-visible:ring-primary/20"
                                                value={approverNotes}
                                                onChange={(e) =>
                                                    setApproverNotes(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    )}

                                {selectedRequest.approver_notes && (
                                    <div className="space-y-1.5 p-3.5 rounded-xl border border-dashed border-border/80 bg-background">
                                        <Label className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                                            Respon Atasan
                                        </Label>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {selectedRequest.approver_notes}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    {selectedRequest.status === "pending" &&
                                    role !== "EMPLOYEE" ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-11 text-xs font-medium uppercase tracking-wider text-rose-600 border-rose-100 hover:bg-rose-50"
                                                onClick={() =>
                                                    updateStatus(
                                                        selectedRequest,
                                                        "rejected",
                                                    )
                                                }
                                            >
                                                <X className="w-4 h-4 mr-2" />{" "}
                                                Tolak
                                            </Button>
                                            <Button
                                                className="flex-1 h-11 text-xs font-medium uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                                                onClick={() =>
                                                    updateStatus(
                                                        selectedRequest,
                                                        "approved",
                                                    )
                                                }
                                            >
                                                <Check className="w-4 h-4 mr-2" />{" "}
                                                Setujui
                                            </Button>
                                        </>
                                    ) : selectedRequest.status === "pending" &&
                                      role === "EMPLOYEE" ? (
                                        <Button
                                            variant="destructive"
                                            className="flex-1 h-11 text-xs font-medium uppercase tracking-wider shadow-lg shadow-rose-500/20"
                                            onClick={() =>
                                                deleteRequest(selectedRequest)
                                            }
                                        >
                                            Batalkan Pengajuan
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="flex-1 h-11 text-xs font-medium uppercase tracking-wider border-border/60"
                                            onClick={() =>
                                                setSelectedRequest(null)
                                            }
                                        >
                                            Tutup
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
