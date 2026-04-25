import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    Search,
    Plus,
    CalendarDays,
    Pencil,
    Building2,
    Flag,
    RotateCcw,
} from "lucide-react";

// UI
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
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/Components/ui/select";

interface Holiday {
    id: string;
    name: string;
    date: string;
    type: "NATIONAL" | "COMPANY";
    description: string | null;
    status: boolean;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function Index({ holidays, filters, role }: any) {
    const [search, setSearch] = useState(filters.search || "");
    const [type, setType] = useState(filters.type || "all");

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selected, setSelected] = useState<Holiday | null>(null);

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ["holidays"] });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: "",
        date: "",
        type: "NATIONAL",
        description: "",
        status: true,
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (editMode && selected) {
            put(route("holidays.update", selected.id), {
                onSuccess: () => {
                    setOpen(false);
                    setEditMode(false);
                    reset();
                },
            });
        } else {
            post(route("holidays.store"), {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                },
            });
        }
    };

    const handleCreate = () => {
        reset();
        setEditMode(false);
        setOpen(true);
    };

    const handleEdit = (item: Holiday) => {
        setSelected(item);
        setEditMode(true);
        setData({
            name: item.name,
            date: item.date,
            type: item.type,
            description: item.description || "",
            status: item.status,
        });
        setOpen(true);
    };

    const applyFilter = () => router.get(route("holidays"), { search, type });

    const hasFilter = search !== "" || type !== "all";

    return (
        <AuthenticatedLayout>
            <Head title="Hari Libur" />

            <div className="space-y-4">
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1 sm:px-0">
                    <div className="space-y-1">
                        <h1 className="text-3xl tracking-tight sm:text-4xl font-medium text-foreground">Hari Libur</h1>
                        <p className="text-sm text-muted-foreground font-light">Kelola libur nasional & internal perusahaan.</p>
                    </div>
                    {role === "OWNER" && (
                        <Button
                            size="sm"
                            onClick={handleCreate}
                            className="h-10 px-6 shadow-lg shadow-primary/20 text-xs font-medium uppercase tracking-wider"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Hari Libur
                        </Button>
                    )}
                </div>

                {/* ── SEARCH & FILTER ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                placeholder="Cari nama libur..."
                                className="pl-9 h-10 sm:h-11 text-sm border-border/60 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                            />
                        </div>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-10 sm:h-11 w-10 sm:w-11 shrink-0 border-border/60"
                            onClick={applyFilter}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="h-10 sm:h-11 flex-1 text-sm border-border/60 bg-background min-w-[140px]">
                                <SelectValue placeholder="Semua Tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Tipe</SelectItem>
                                <SelectItem value="NATIONAL">Nasional</SelectItem>
                                <SelectItem value="COMPANY">Internal</SelectItem>
                            </SelectContent>
                        </Select>

                        {hasFilter && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-10 sm:h-11 px-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                                onClick={() => {
                                    setSearch("");
                                    setType("all");
                                    router.get(route("holidays"), {});
                                }}
                            >
                                <RotateCcw className="h-4 w-4 mr-2" /> Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* ── Mobile: Card list ── */}
                <div className="space-y-2 sm:hidden">
                    {holidays.data.length > 0 ? (
                        holidays.data.map((item: Holiday) => (
                            <Card key={item.id} className="border border-muted">
                                <CardContent className="p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                {item.type === "NATIONAL" ? (
                                                    <Flag className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                                                ) : (
                                                    <Building2 className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                                                )}
                                                <span className="truncate text-sm font-medium">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <CalendarDays className="h-3 w-3 shrink-0" />
                                                {formatDate(item.date)}
                                            </div>
                                            <div className="flex items-center gap-1.5 pt-0.5">
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px]"
                                                >
                                                    {item.type === "NATIONAL"
                                                        ? "Nasional"
                                                        : "Internal"}
                                                </Badge>
                                                <Badge
                                                    variant={
                                                        item.status
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="text-[10px]"
                                                >
                                                    {item.status
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </Badge>
                                            </div>
                                        </div>
                                        {role === "OWNER" && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 shrink-0"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            Tidak ada data hari libur.
                        </div>
                    )}
                </div>

                {/* ── Desktop: Table ── */}
                <Card className="hidden sm:block">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Daftar Hari Libur
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Status</TableHead>
                                    {role === "OWNER" && (
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {holidays.data.length > 0 ? (
                                    holidays.data.map((item: Holiday) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatDate(item.date)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {item.type === "NATIONAL"
                                                        ? "Nasional"
                                                        : "Internal"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        item.status
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {item.status
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </Badge>
                                            </TableCell>
                                            {role === "OWNER" && (
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="gap-1.5"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={role === "OWNER" ? 5 : 4}
                                            className="py-10 text-center text-muted-foreground"
                                        >
                                            Tidak ada data hari libur.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* ── Dialog Form ── */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-base">
                                {editMode
                                    ? "Edit Hari Libur"
                                    : "Tambah Hari Libur"}
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Hari libur akan menonaktifkan presensi pada
                                tanggal tersebut.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Nama</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Contoh: Idul Fitri"
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">Tanggal</Label>
                                <Input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData("date", e.target.value)
                                    }
                                />
                                {errors.date && (
                                    <p className="text-xs text-destructive">
                                        {errors.date}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">Tipe</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(val: any) =>
                                        setData("type", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NATIONAL">
                                            Nasional
                                        </SelectItem>
                                        <SelectItem value="COMPANY">
                                            Internal
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">
                                    Deskripsi{" "}
                                    <span className="text-muted-foreground">
                                        (opsional)
                                    </span>
                                </Label>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={3}
                                    className="resize-none text-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-muted p-3">
                                <div>
                                    <div className="text-sm font-medium">
                                        Status aktif
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Aktif = presensi dimatikan
                                    </div>
                                </div>
                                <Switch
                                    checked={data.status}
                                    onCheckedChange={(v) =>
                                        setData("status", v)
                                    }
                                />
                            </div>

                            <DialogFooter className="gap-2 pt-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 sm:flex-none"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 sm:flex-none"
                                >
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
