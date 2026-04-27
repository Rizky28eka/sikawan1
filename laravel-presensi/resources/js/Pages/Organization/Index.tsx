import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
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
import { Card } from "@/Components/ui/card";
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
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Separator } from "@/Components/ui/separator";
import {
    Plus,
    Network,
    MapPin,
    Search,
    Users,
    Navigation,
    MoreHorizontal,
    Pencil,
    Trash2,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Department {
    id: string;
    name: string;
    description: string | null;
    manager_id: string | null;
    manager?: {
        id: string;
        full_name: string;
    };
    users_count: number;
    created_at: string;
}

interface Site {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    radius: number;
    status: boolean;
    is_wfh: boolean;
    strict_mode: boolean;
    shape_type: "circle" | "polygon";
    polygon_coordinates?: any[] | string;
    users_count: number;
}

interface Manager {
    id: string;
    full_name: string;
}

interface Props extends PageProps {
    data: {
        data: any[];
        total: number;
        per_page: number;
        current_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        last_page: number;
    };
    tab: "departments" | "locations";
    filters: {
        search?: string;
        tab?: string;
    };
    managers: Manager[];
    role: string;
}

export default function Index({ data, tab, filters, managers, role }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false);
    const [isEditDeptOpen, setIsEditDeptOpen] = useState(false);
    const [isCreateSiteOpen, setIsCreateSiteOpen] = useState(false);
    const [isEditSiteOpen, setIsEditSiteOpen] = useState(false);
    const [isMembersOpen, setIsMembersOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ["data"] });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const deptForm = useForm({ name: "", description: "", manager_id: "" });
    const siteForm = useForm({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        radius: "100",
        status: true,
        is_wfh: false,
        strict_mode: true,
        shape_type: "circle" as "circle" | "polygon",
        polygon_coordinates: [] as any[],
    });

    const handleTabChange = (value: string) => {
        router.get(
            route("organization"),
            {
                ...filters,
                tab: value,
                search: "",
            },
            { preserveState: false },
        );
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            route("organization"),
            { ...filters, search, tab },
            { preserveState: true },
        );
    };

    const resetSearch = () => {
        setSearch("");
        router.get(route("organization"), { tab }, { preserveState: true });
    };

    const handleCreateDept = (e: React.FormEvent) => {
        e.preventDefault();
        deptForm.post(route("organization.departments.store"), {
            onSuccess: () => {
                setIsCreateDeptOpen(false);
                deptForm.reset();
                toast.success("Departemen berhasil ditambahkan!");
            },
        });
    };

    const handleUpdateDept = (e: React.FormEvent) => {
        e.preventDefault();
        deptForm.put(
            route("organization.departments.update", selectedItem.id),
            {
                onSuccess: () => {
                    setIsEditDeptOpen(false);
                    deptForm.reset();
                    toast.success("Departemen berhasil diperbarui!");
                },
            },
        );
    };

    const deleteDept = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus departemen ini?")) {
            router.delete(route("organization.departments.destroy", id), {
                onSuccess: () => toast.success("Departemen berhasil dihapus."),
            });
        }
    };

    const handleCreateSite = (e: React.FormEvent) => {
        e.preventDefault();
        siteForm.post(route("organization.sites.store"), {
            onSuccess: () => {
                setIsCreateSiteOpen(false);
                siteForm.reset();
                toast.success("Lokasi kerja berhasil ditambahkan!");
            },
        });
    };

    const handleUpdateSite = (e: React.FormEvent) => {
        e.preventDefault();
        siteForm.put(route("organization.sites.update", selectedItem.id), {
            onSuccess: () => {
                setIsEditSiteOpen(false);
                siteForm.reset();
                toast.success("Lokasi kerja berhasil diperbarui!");
            },
        });
    };

    const deleteSite = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus lokasi kerja ini?")) {
            router.delete(route("organization.sites.destroy", id), {
                onSuccess: () =>
                    toast.success("Lokasi kerja berhasil dihapus."),
            });
        }
    };

    const openMembers = async (item: any, type: "department" | "site") => {
        setSelectedItem(item);
        setIsMembersOpen(true);
        setLoadingMembers(true);
        try {
            const response = await axios.get(
                route("organization.members", { type, id: item.id }),
            );
            setMembers(response.data);
        } catch {
            toast.error("Gagal memuat anggota.");
        } finally {
            setLoadingMembers(false);
        }
    };

    const isDeptDialog = isCreateDeptOpen || isEditDeptOpen;
    const isSiteDialog = isCreateSiteOpen || isEditSiteOpen;

    return (
        <AuthenticatedLayout>
            <Head title="Struktur Organisasi" />

            <div className="w-full space-y-4 sm:space-y-6">
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1 sm:px-0">
                    <div className="space-y-1">
                        <h1 className="text-3xl tracking-tight sm:text-4xl font-medium text-foreground">
                            Organisasi
                        </h1>
                        <p className="text-sm text-muted-foreground font-light">
                            Kelola unit departemen dan perimeter lokasi kerja
                            (Geofencing).
                        </p>
                    </div>
                    {role === "OWNER" && (
                        <Button
                            size="sm"
                            className="h-10 px-6 shadow-lg shadow-primary/20 text-xs font-medium uppercase tracking-wider"
                            onClick={() =>
                                tab === "departments"
                                    ? setIsCreateDeptOpen(true)
                                    : setIsCreateSiteOpen(true)
                            }
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {tab === "departments"
                                ? "Tambah Unit"
                                : "Tambah Lokasi"}
                        </Button>
                    )}
                </div>

                {/* ── TABS & SEARCH ROW ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Tabs
                        value={tab}
                        onValueChange={handleTabChange}
                        className="w-full sm:w-auto"
                    >
                        <TabsList className="h-10 sm:h-11 p-1 bg-muted/50 border-none w-full sm:w-auto overflow-x-auto justify-start no-scrollbar">
                            <TabsTrigger
                                value="departments"
                                className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-5 data-[state=active]:bg-background font-medium"
                            >
                                <Network className="h-3.5 w-3.5 mr-2" />{" "}
                                Departemen
                            </TabsTrigger>
                            <TabsTrigger
                                value="locations"
                                className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-5 data-[state=active]:bg-background font-medium"
                            >
                                <MapPin className="h-3.5 w-3.5 mr-2" /> Lokasi
                                Kerja
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                placeholder={`Cari ${tab === "departments" ? "departemen" : "lokasi"}...`}
                                className="pl-9 h-10 sm:h-11 text-sm border-border/60 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleSearch()
                                }
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 sm:h-11 w-10 sm:w-11 shrink-0 border-border/60"
                            onClick={() => handleSearch()}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* ── CONTENT AREA ── */}
                <Card className="border-border/60 shadow-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/5">
                                <TableRow className="hover:bg-transparent border-b border-border/60">
                                    {tab === "departments" ? (
                                        <>
                                            <TableHead className="pl-4 sm:pl-6 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">
                                                Detail Unit
                                            </TableHead>
                                            <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12 hidden sm:table-cell">
                                                Manager / Head
                                            </TableHead>
                                            <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">
                                                Anggota
                                            </TableHead>
                                            <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12 hidden lg:table-cell">
                                                Tgl Rilis
                                            </TableHead>
                                        </>
                                    ) : (
                                        <>
                                            <TableHead className="pl-4 sm:pl-6 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">
                                                Lokasi & Alamat
                                            </TableHead>
                                            <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12 hidden sm:table-cell">
                                                Radius Geofence
                                            </TableHead>
                                            <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">
                                                Kapasitas
                                            </TableHead>
                                            <TableHead className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">
                                                Status
                                            </TableHead>
                                        </>
                                    )}
                                    <TableHead className="text-right pr-4 sm:pr-6 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground h-11 sm:h-12">
                                        Opsi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.length > 0 ? (
                                    data.data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-muted/30 border-b border-border/40 group transition-colors"
                                        >
                                            {tab === "departments" ? (
                                                <>
                                                    <TableCell className="pl-4 sm:pl-6 py-3 sm:py-4">
                                                        <div className="space-y-0.5">
                                                            <p className="text-xs sm:text-sm font-medium text-foreground leading-none">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-[9px] sm:text-[10px] font-medium text-muted-foreground italic truncate max-w-[150px] sm:max-w-[250px]">
                                                                {item.description ||
                                                                    "Tanpa deskripsi departemen"}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        {item.manager ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                                                                    {item.manager.full_name.charAt(
                                                                        0,
                                                                    )}
                                                                </div>
                                                                <span className="text-xs font-medium text-foreground">
                                                                    {
                                                                        item
                                                                            .manager
                                                                            .full_name
                                                                    }
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] font-medium text-muted-foreground/40 uppercase">
                                                                Belum Ditunjuk
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 px-2 text-[10px] font-medium hover:bg-primary/5 hover:text-primary transition-colors"
                                                            onClick={() =>
                                                                openMembers(
                                                                    item,
                                                                    "department",
                                                                )
                                                            }
                                                        >
                                                            <Users className="size-3 mr-1.5" />{" "}
                                                            {item.users_count}{" "}
                                                            Orang
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell className="hidden lg:table-cell">
                                                        <span className="text-[10px] font-mono font-medium text-muted-foreground">
                                                            {new Date(
                                                                item.created_at,
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                },
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell className="pl-4 sm:pl-6 py-3 sm:py-4">
                                                        <div className="space-y-1">
                                                            <p className="text-xs sm:text-sm font-medium text-foreground leading-none">
                                                                {item.name}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground uppercase font-medium tracking-tight">
                                                                <Navigation className="size-2.5" />
                                                                <span className="truncate max-w-[120px] sm:max-w-none">
                                                                    {
                                                                        item.address
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] font-mono font-medium border-border/60 bg-muted/20"
                                                        >
                                                            {item.radius} Meter
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 px-2 text-[10px] font-medium"
                                                            onClick={() =>
                                                                openMembers(
                                                                    item,
                                                                    "site",
                                                                )
                                                            }
                                                        >
                                                            <Users className="size-3 mr-1.5" />{" "}
                                                            {item.users_count}{" "}
                                                            Member
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.status ? (
                                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-medium uppercase tracking-widest px-2 group-hover:bg-emerald-100 transition-colors">
                                                                Aktif
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[9px] font-medium uppercase tracking-widest px-2 group-hover:bg-rose-100 transition-colors">
                                                                Nonaktif
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </>
                                            )}

                                            <TableCell className="text-right pr-4 sm:pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 rounded-full group-hover:bg-background shadow-none"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-48 border-border/60"
                                                    >
                                                        <DropdownMenuLabel className="text-[10px] font-medium uppercase text-muted-foreground px-2 py-1.5">
                                                            Opsi{" "}
                                                            {tab ===
                                                            "departments"
                                                                ? "Unit"
                                                                : "Lokasi"}
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            className="text-xs font-medium"
                                                            onClick={() =>
                                                                openMembers(
                                                                    item,
                                                                    tab ===
                                                                        "departments"
                                                                        ? "department"
                                                                        : "site",
                                                                )
                                                            }
                                                        >
                                                            <Users className="mr-2 h-4 w-4" />{" "}
                                                            Kelola Anggota
                                                        </DropdownMenuItem>
                                                        {role === "OWNER" && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    className="text-xs font-medium"
                                                                    onClick={() => {
                                                                        setSelectedItem(
                                                                            item,
                                                                        );
                                                                        if (
                                                                            tab ===
                                                                            "departments"
                                                                        ) {
                                                                            deptForm.setData(
                                                                                {
                                                                                    name: item.name,
                                                                                    description:
                                                                                        item.description ||
                                                                                        "",
                                                                                    manager_id:
                                                                                        item.manager_id ||
                                                                                        "",
                                                                                },
                                                                            );
                                                                            setIsEditDeptOpen(
                                                                                true,
                                                                            );
                                                                        } else {
                                                                            siteForm.setData(
                                                                                {
                                                                                    name: item.name,
                                                                                    address:
                                                                                        item.address,
                                                                                    latitude:
                                                                                        String(
                                                                                            item.latitude,
                                                                                        ),
                                                                                    longitude:
                                                                                        String(
                                                                                            item.longitude,
                                                                                        ),
                                                                                    radius: String(
                                                                                        item.radius,
                                                                                    ),
                                                                                    status: item.status,
                                                                                    is_wfh:
                                                                                        item.is_wfh ||
                                                                                        false,
                                                                                    strict_mode:
                                                                                        item.strict_mode ??
                                                                                        true,
                                                                                    shape_type:
                                                                                        item.shape_type ||
                                                                                        "circle",
                                                                                    polygon_coordinates:
                                                                                        item.polygon_coordinates ||
                                                                                        [],
                                                                                },
                                                                            );
                                                                            setIsEditSiteOpen(
                                                                                true,
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    <Pencil className="mr-2 h-4 w-4" />{" "}
                                                                    Edit Data
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-xs font-medium text-rose-600 focus:text-rose-700"
                                                                    onClick={() =>
                                                                        tab ===
                                                                        "departments"
                                                                            ? deleteDept(
                                                                                  item.id,
                                                                              )
                                                                            : deleteSite(
                                                                                  item.id,
                                                                              )
                                                                    }
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />{" "}
                                                                    Hapus
                                                                    Permanen
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-48 sm:h-64 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="size-10 sm:size-12 rounded-full bg-muted flex items-center justify-center">
                                                    <Network className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/40" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-xs sm:text-sm font-medium text-foreground">
                                                        Data Kosong
                                                    </h4>
                                                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest leading-relaxed">
                                                        Tidak ada{" "}
                                                        {tab === "departments"
                                                            ? "departemen"
                                                            : "lokasi"}{" "}
                                                        yang ditemukan.
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
                                {data.current_page}
                            </span>{" "}
                            dari {data.last_page}
                        </p>
                        <div className="flex items-center gap-1.5">
                            {data.links.map((link, i) => (
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

            {/* ── DEPARTMENT DIALOG ── */}
            <Dialog
                open={isDeptDialog}
                onOpenChange={(v) =>
                    !v && (setIsCreateDeptOpen(false), setIsEditDeptOpen(false))
                }
            >
                <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden mt-auto sm:mt-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/5 text-left">
                        <DialogTitle className="text-lg font-medium">
                            {isEditDeptOpen
                                ? "Edit Departemen"
                                : "Tambah Departemen"}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium">
                            Definisikan unit organisasi perusahaan untuk
                            pengelompokan karyawan.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={
                            isEditDeptOpen ? handleUpdateDept : handleCreateDept
                        }
                    >
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Nama Departemen
                                </Label>
                                <Input
                                    placeholder="Misal: Human Resources"
                                    className="h-10 text-sm"
                                    value={deptForm.data.name}
                                    onChange={(e) =>
                                        deptForm.setData("name", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Manager Bertanggung Jawab
                                </Label>
                                <Select
                                    value={deptForm.data.manager_id || "none"}
                                    onValueChange={(v) =>
                                        deptForm.setData(
                                            "manager_id",
                                            v === "none" ? "" : v,
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-10 text-sm">
                                        <SelectValue placeholder="Pilih Manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Tanpa Manager
                                        </SelectItem>
                                        {managers.map((m) => (
                                            <SelectItem key={m.id} value={m.id}>
                                                {m.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Deskripsi (Opsional)
                                </Label>
                                <Textarea
                                    placeholder="Jelaskan peran unit ini..."
                                    className="resize-none h-24 text-sm"
                                    value={deptForm.data.description}
                                    onChange={(e) =>
                                        deptForm.setData(
                                            "description",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-border/60 flex items-center justify-end gap-3 bg-muted/5">
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-10 text-xs font-medium uppercase tracking-wider"
                                onClick={() => (
                                    setIsCreateDeptOpen(false),
                                    setIsEditDeptOpen(false)
                                )}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="h-10 px-6 text-xs font-medium uppercase tracking-wider shadow-lg shadow-primary/10"
                                disabled={deptForm.processing}
                            >
                                {isEditDeptOpen
                                    ? "Simpan Perubahan"
                                    : "Tambah Unit"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── SITE DIALOG ── */}
            <Dialog
                open={isSiteDialog}
                onOpenChange={(v) =>
                    !v && (setIsCreateSiteOpen(false), setIsEditSiteOpen(false))
                }
            >
                <DialogContent className="sm:max-w-lg p-0 border-none shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden mt-auto sm:mt-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/5 text-left">
                        <DialogTitle className="text-lg font-medium">
                            {isEditSiteOpen ? "Edit Lokasi" : "Tambah Lokasi"}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium">
                            Atur perimeter koordinat (Geofencing) tempat
                            karyawan melakukan presensi.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={
                            isEditSiteOpen ? handleUpdateSite : handleCreateSite
                        }
                    >
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Label Lokasi
                                </Label>
                                <Input
                                    placeholder="Misal: Head Office Bekasi"
                                    className="h-10 text-sm"
                                    value={siteForm.data.name}
                                    onChange={(e) =>
                                        siteForm.setData("name", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Alamat Fisik Lengkap
                                </Label>
                                <Input
                                    placeholder="Jl. Raya Utama No. 123..."
                                    className="h-10 text-sm"
                                    value={siteForm.data.address}
                                    onChange={(e) =>
                                        siteForm.setData(
                                            "address",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Latitude
                                    </Label>
                                    <Input
                                        value={siteForm.data.latitude}
                                        onChange={(e) =>
                                            siteForm.setData(
                                                "latitude",
                                                e.target.value,
                                            )
                                        }
                                        className="h-10 text-sm font-mono"
                                        placeholder="-6.23456"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Longitude
                                    </Label>
                                    <Input
                                        value={siteForm.data.longitude}
                                        onChange={(e) =>
                                            siteForm.setData(
                                                "longitude",
                                                e.target.value,
                                            )
                                        }
                                        className="h-10 text-sm font-mono"
                                        placeholder="106.7890"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Radius Absensi (Meter)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={siteForm.data.radius}
                                        onChange={(e) =>
                                            siteForm.setData(
                                                "radius",
                                                e.target.value,
                                            )
                                        }
                                        className="h-10 text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Status Operasional
                                    </Label>
                                    <Select
                                        value={
                                            siteForm.data.status
                                                ? "true"
                                                : "false"
                                        }
                                        onValueChange={(v) =>
                                            siteForm.setData(
                                                "status",
                                                v === "true",
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-10 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">
                                                Aktif (Dapat Digunakan)
                                            </SelectItem>
                                            <SelectItem value="false">
                                                Nonaktif (Dikunci)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator className="my-2" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5 p-3 rounded-lg border border-border/40 bg-muted/5 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-[10px] font-medium uppercase tracking-wider">
                                            WFH Allowed
                                        </Label>
                                        <p className="text-[9px] text-muted-foreground">
                                            Izinkan kerja diluar area
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={
                                            siteForm.data.is_wfh
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        className="h-7 text-[9px] font-medium uppercase"
                                        onClick={() =>
                                            siteForm.setData(
                                                "is_wfh",
                                                !siteForm.data.is_wfh,
                                            )
                                        }
                                    >
                                        {siteForm.data.is_wfh ? "ON" : "OFF"}
                                    </Button>
                                </div>
                                <div className="space-y-1.5 p-3 rounded-lg border border-border/40 bg-muted/5 flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-[10px] font-medium uppercase tracking-wider">
                                            Strict Mode
                                        </Label>
                                        <p className="text-[9px] text-muted-foreground">
                                            Kunci absensi di perimeter
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={
                                            siteForm.data.strict_mode
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        className="h-7 text-[9px] font-medium uppercase"
                                        onClick={() =>
                                            siteForm.setData(
                                                "strict_mode",
                                                !siteForm.data.strict_mode,
                                            )
                                        }
                                    >
                                        {siteForm.data.strict_mode
                                            ? "ON"
                                            : "OFF"}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Metode Geofencing
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        type="button"
                                        variant={
                                            siteForm.data.shape_type ===
                                            "circle"
                                                ? "default"
                                                : "outline"
                                        }
                                        className="h-14 flex-col gap-1 text-[10px] font-medium uppercase tracking-widest"
                                        onClick={() =>
                                            siteForm.setData(
                                                "shape_type",
                                                "circle",
                                            )
                                        }
                                    >
                                        <div className="size-4 rounded-full border-2 border-current mb-0.5" />
                                        Radius Lingkaran
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={
                                            siteForm.data.shape_type ===
                                            "polygon"
                                                ? "default"
                                                : "outline"
                                        }
                                        className="h-14 flex-col gap-1 text-[10px] font-medium uppercase tracking-widest"
                                        onClick={() =>
                                            siteForm.setData(
                                                "shape_type",
                                                "polygon",
                                            )
                                        }
                                    >
                                        <div className="size-4 rotate-45 border-2 border-current mb-0.5" />
                                        Poligon (Precise)
                                    </Button>
                                </div>
                            </div>

                            {siteForm.data.shape_type === "polygon" && (
                                <div className="space-y-1.5 p-4 rounded-xl border border-primary/20 bg-primary/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="size-5 rounded bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-medium">
                                            P
                                        </div>
                                        <Label className="text-[10px] font-medium uppercase tracking-wider">
                                            Polygon Coordinates (JSON)
                                        </Label>
                                    </div>
                                    <Textarea
                                        placeholder='[{"lat": -6.1, "lng": 106.1}, ...]'
                                        className="font-mono text-[11px] h-32 bg-background border-primary/20"
                                        value={
                                            typeof siteForm.data
                                                .polygon_coordinates ===
                                            "string"
                                                ? siteForm.data
                                                      .polygon_coordinates
                                                : JSON.stringify(
                                                      siteForm.data
                                                          .polygon_coordinates ||
                                                          [],
                                                  )
                                        }
                                        onChange={(e) =>
                                            siteForm.setData(
                                                "polygon_coordinates" as any,
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="text-[9px] text-muted-foreground mt-1 tabular-nums">
                                        Format: [ {"{"} "lat": -6.xx, "lng":
                                        106.xx {"}"}, ... ]
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-border/60 flex items-center justify-end gap-3 bg-muted/5">
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-10 text-xs font-medium uppercase tracking-wider"
                                onClick={() => (
                                    setIsCreateSiteOpen(false),
                                    setIsEditSiteOpen(false)
                                )}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="h-10 px-6 text-xs font-medium uppercase tracking-wider shadow-lg shadow-primary/10"
                                disabled={siteForm.processing}
                            >
                                Simpan Data
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── MEMBERS LIST DIALOG ── */}
            <Dialog open={isMembersOpen} onOpenChange={setIsMembersOpen}>
                <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden mt-auto sm:mt-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/5 text-left">
                        <DialogTitle className="text-lg font-medium">
                            Daftar Anggota
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium uppercase tracking-wider text-primary">
                            {selectedItem?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 max-h-[50vh] overflow-y-auto">
                        {loadingMembers ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-50">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <span className="text-[10px] font-medium uppercase tracking-widest">
                                    Memuat database...
                                </span>
                            </div>
                        ) : members.length > 0 ? (
                            <div className="space-y-3">
                                {members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center text-primary text-xs font-medium border border-primary/10">
                                            {member.full_name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-foreground leading-tight">
                                                {member.full_name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground italic font-medium uppercase tracking-tight">
                                                {member.employee_id || "ID N/A"}{" "}
                                                · {member.position || "Staff"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 opacity-40">
                                <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                <p className="text-xs font-medium uppercase tracking-widest">
                                    Belum ada anggota terdaftar
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="px-6 py-4 border-t border-border/60 bg-muted/5">
                        <Button
                            variant="outline"
                            className="w-full h-10 text-xs font-medium uppercase tracking-wider border-border/60"
                            onClick={() => setIsMembersOpen(false)}
                        >
                            Selesai
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
