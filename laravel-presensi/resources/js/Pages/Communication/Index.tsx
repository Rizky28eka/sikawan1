import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { PageProps } from "@/types";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { 
    Megaphone, 
    Bell, 
    Plus, 
    Search, 
    MoreHorizontal, 
    Edit2, 
    Trash2,
    CheckCircle2,
    Clock,
    User,
    Building2,
    Check,
    Filter,
    Loader2,
    MessageSquare,
    ChevronRight,
    Search as SearchIcon,
    AlertCircle,
    RotateCcw,
    X,
    Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";

interface Props extends PageProps {
    data: {
        data: any[];
        links: any[];
        total: number;
        current_page: number;
        last_page: number;
    };
    tab: 'announcements' | 'notifications';
    filters: {
        search?: string;
        tab: string;
    };
    departments: { id: string, name: string }[];
    role: string;
}

export default function Index({ data, tab, filters, departments, role }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ["data"] });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const { data: formData, setData, post, put, processing, reset, errors } = useForm({
        title: '',
        content: '',
        type: role === 'SUPERADMIN' ? 'SYSTEM' : 'COMPANY',
        target_type: 'ALL',
        target_id: '',
        department_id: '',
        published_at: '',
        is_published: true,
    });

    const handleTabChange = (value: string) => {
        router.get(route('communication'), { ...filters, tab: value, search: "" }, { preserveState: false });
    };

    const handleSearch = (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        router.get(route('communication'), { ...filters, search: searchQuery, tab }, { preserveState: true });
    };

    const handleCreateAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('communication.announcements.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
                toast.success("Pengumuman berhasil diterbitkan!");
            }
        });
    };

    const handleUpdateAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        put(route('communication.announcements.update', selectedItem.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                reset();
                toast.success("Pengumuman berhasil diperbarui!");
            }
        });
    };

    const handleDeleteAnnouncement = (id: string) => {
        if (confirm('Hapus pengumuman ini?')) {
            router.delete(route('communication.announcements.destroy', id), {
                onSuccess: () => toast.success("Pengumuman berhasil dihapus.")
            });
        }
    };

    const markAsRead = (id: string) => {
        router.post(route('communication.notifications.read', id));
    };

    const markAllAsRead = () => {
        router.post(route('communication.notifications.read-all'), {}, {
            onSuccess: () => toast.success("Semua notifikasi ditandai dibaca.")
        });
    };

    const deleteNotification = (id: string) => {
        router.delete(route('communication.notifications.destroy', id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pusat Komunikasi & Pengumuman" />

            <div className="w-full space-y-4 sm:space-y-6">
                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1 sm:px-0">
                    <div className="space-y-1">
                        <h1 className="text-3xl tracking-tight sm:text-4xl font-medium text-foreground">Pusat Komunikasi</h1>
                        <p className="text-sm text-muted-foreground font-light">Siarkan informasi penting dan pantau aktivitas sistem melalui notifikasi.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {tab === 'notifications' && data.data.length > 0 && (
                            <Button variant="outline" size="sm" onClick={markAllAsRead} className="h-10 text-[10px] font-medium uppercase tracking-wider">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Dibaca
                            </Button>
                        )}
                        {role !== 'EMPLOYEE' && tab === 'announcements' && (
                            <Button 
                                size="sm" 
                                className="h-10 px-6 shadow-lg shadow-primary/20 text-xs font-medium uppercase tracking-wider" 
                                onClick={() => { reset(); setIsCreateOpen(true); }}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Siarkan Pengumuman
                            </Button>
                        )}
                    </div>
                </div>

                {/* ── TABS & SEARCH ROW ── */}
                <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <TabsList className="h-10 sm:h-11 p-1 bg-muted/50 border-none w-full sm:w-auto overflow-x-auto justify-start no-scrollbar">
                            <TabsTrigger value="announcements" className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-5 data-[state=active]:bg-background font-medium">
                                <Megaphone className="h-3.5 w-3.5 mr-2" /> Pengumuman
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-5 data-[state=active]:bg-background font-medium">
                                <Bell className="h-3.5 w-3.5 mr-2" /> Notifikasi
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder={`Cari pesan...`}
                                    className="pl-9 h-10 sm:h-11 text-sm border-border/60 bg-background"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                    <div className="min-h-[400px] mt-4 sm:mt-6">
                        <TabsContent value="announcements" className="m-0 space-y-4 animate-in fade-in duration-500">
                            {data.data.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {data.data.map((item: any) => (
                                        <Card key={item.id} className={cn(
                                            "shadow-none border-border/60 overflow-hidden group hover:border-primary/40 transition-all",
                                            !item.is_published && "bg-muted/30 border-dashed"
                                        )}>
                                            <CardContent className="p-0">
                                                <div className="p-5 space-y-3">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-border/60",
                                                                item.type === 'SYSTEM' ? "bg-rose-50 text-rose-600" : "bg-primary/5 text-primary"
                                                            )}>
                                                                <Megaphone className="h-5 w-5" />
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant={item.type === 'SYSTEM' ? 'destructive' : 'secondary'} className="text-[8px] font-medium uppercase tracking-wider h-4 px-1.5 border-none">
                                                                        {item.type}
                                                                    </Badge>
                                                                    {!item.is_published && (
                                                                        <Badge variant="outline" className="text-[8px] border-amber-200 text-amber-700 bg-amber-50 h-4 px-1.5 font-medium uppercase">Draft</Badge>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    {item.published_at ? format(new Date(item.published_at), "dd MMM yyyy", { locale: id }) : 'Waktu Belum Diset'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {role !== 'EMPLOYEE' && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-muted group-hover:opacity-100 opacity-50 shadow-none">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-48 border-border/60">
                                                                    <DropdownMenuLabel className="text-[10px] font-medium uppercase text-muted-foreground px-2 py-1.5">Kelola Siaran</DropdownMenuLabel>
                                                                    <DropdownMenuItem className="text-xs font-medium" onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setData({
                                                                            title: item.title,
                                                                            content: item.content,
                                                                            type: item.type,
                                                                            target_type: item.target_type,
                                                                            target_id: item.target_id || '',
                                                                            department_id: item.department_id || '',
                                                                            published_at: item.published_at ? item.published_at.substring(0, 16) : '',
                                                                            is_published: item.is_published,
                                                                        });
                                                                        setIsEditOpen(true);
                                                                    }}>
                                                                        <Pencil className="mr-2 h-4 w-4" /> Edit Konten
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-xs font-medium text-rose-600 focus:text-rose-700" onClick={() => handleDeleteAnnouncement(item.id)}>
                                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Siaran
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <h3 className="text-sm sm:text-base font-medium text-foreground leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                                                            {item.content}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="px-5 py-3 border-t border-border/40 bg-muted/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="size-5 border border-border/60">
                                                            <AvatarFallback className="bg-primary/5 text-primary text-[8px] font-medium">{item.creator?.full_name?.charAt(0) || 'S'}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-tight italic">{item.creator?.full_name || 'System Auto'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[9px] font-medium text-primary uppercase tracking-widest">
                                                        <Building2 className="h-2.5 w-2.5" />
                                                        {item.target_type === 'ALL' ? 'Semua Unit' : 'Grup Khusus'}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed rounded-2xl bg-muted/20 border-border/40">
                                    <Megaphone className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-foreground">Siaran Kosong</h4>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Belum ada pengumuman yang diterbitkan.</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="notifications" className="m-0 space-y-3 animate-in slide-in-from-bottom-2 duration-500">
                            {data.data.length > 0 ? (
                                <div className="space-y-3 max-w-4xl mx-auto">
                                    {data.data.map((log: any) => (
                                        <div 
                                            key={log.id} 
                                            className={cn(
                                                "flex items-start gap-4 p-4 rounded-xl border transition-all relative group",
                                                log.read_at ? "bg-muted/10 border-border/40" : "bg-background shadow-md border-l-4 border-l-primary border-border/60"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border",
                                                log.read_at ? "bg-muted text-muted-foreground/60 border-border/40" : "bg-primary/10 text-primary border-primary/20"
                                            )}>
                                                <Bell className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-center justify-between gap-4">
                                                    <h4 className={cn("text-xs sm:text-sm font-medium truncate uppercase tracking-tight", log.read_at ? "text-muted-foreground" : "text-foreground")}>{log.title}</h4>
                                                    <span className="text-[10px] font-mono font-medium text-muted-foreground/60 shrink-0">
                                                        {log.created_at ? format(new Date(log.created_at), "dd/MM · HH:mm") : '--/--'}
                                                    </span>
                                                </div>
                                                <p className={cn(
                                                    "text-[11px] sm:text-xs leading-relaxed line-clamp-2 italic font-medium",
                                                    log.read_at ? "text-muted-foreground/60" : "text-muted-foreground"
                                                )}>
                                                    {log.message}
                                                </p>
                                                <div className="flex gap-4 pt-2">
                                                    {!log.read_at && (
                                                        <button 
                                                            onClick={() => markAsRead(log.id)} 
                                                            className="text-[10px] font-medium text-primary hover:text-primary/70 flex items-center gap-1.5 uppercase tracking-wider"
                                                        >
                                                            <CheckCircle2 className="h-3 w-3" /> Tandai Dibaca
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => deleteNotification(log.id)} 
                                                        className="text-[10px] font-medium text-muted-foreground hover:text-destructive flex items-center gap-1.5 uppercase tracking-wider transition-colors"
                                                    >
                                                        <Trash2 className="h-3 w-3" /> Hapus Permanen
                                                    </button>
                                                </div>
                                            </div>
                                            {!log.read_at && (
                                                <div className="absolute top-4 right-3 h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed rounded-2xl bg-muted/20 border-border/40">
                                    <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-foreground">Logs Bersih</h4>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Tidak ada notifikasi sistem saat ini.</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Pagination */}
                {data.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-border/60 bg-muted/5 flex flex-col xs:flex-row items-center justify-between gap-3">
                        <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground italic">
                            Halaman <span className="text-foreground">{data.current_page}</span> dari {data.last_page}
                        </p>
                        <div className="flex items-center gap-1.5">
                            {data.links.map((link: any, i: number) => (
                                <Button
                                    key={i}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    disabled={!link.url}
                                    className={cn(
                                        "h-7 min-w-7 px-2 text-[10px] font-medium",
                                        !link.url && "opacity-50"
                                    )}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* CREATE / EDIT DIALOG */}
            <Dialog open={isCreateOpen || isEditOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsCreateOpen(false);
                    setIsEditOpen(false);
                    reset();
                }
            }}>
                <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden mt-auto sm:mt-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/5 text-left">
                        <DialogTitle className="text-lg font-medium">{isEditOpen ? 'Edit Pengumuman' : 'Baru Siaran Pengumuman'}</DialogTitle>
                        <DialogDescription className="text-xs font-medium italic">Informasi ini akan didistribusikan langsung ke dashboard karyawan terpilih.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={isEditOpen ? handleUpdateAnnouncement : handleCreateAnnouncement}>
                        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Judul Siaran</Label>
                                <Input 
                                    className="h-11 text-sm font-medium" 
                                    value={formData.title} 
                                    onChange={e => setData('title', e.target.value)} 
                                    placeholder="Misal: Update Kebijakan WFH..." 
                                    required 
                                />
                                {errors.title && <p className="text-rose-500 text-[10px] font-medium uppercase">{errors.title}</p>}
                            </div>
                            
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Konten Pesan</Label>
                                <Textarea 
                                    className="resize-none h-32 text-sm leading-relaxed" 
                                    value={formData.content} 
                                    onChange={e => setData('content', e.target.value)} 
                                    placeholder="Tulis instruksi atau informasi lengkap di sini..." 
                                    required 
                                />
                                {errors.content && <p className="text-rose-500 text-[10px] font-medium uppercase">{errors.content}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Label Kategori</Label>
                                    <Select 
                                        disabled={role !== 'SUPERADMIN' && isEditOpen}
                                        value={formData.type} 
                                        onValueChange={v => setData('type', v)}
                                    >
                                        <SelectTrigger className="h-10 text-xs font-medium uppercase"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {role === 'SUPERADMIN' && <SelectItem value="SYSTEM" className="text-xs font-medium">SYSTEM ALERT</SelectItem>}
                                            <SelectItem value="COMPANY" className="text-xs font-medium">INTERNAL INFO</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Target Audience</Label>
                                    <Select value={formData.target_type} onValueChange={v => setData('target_type', v)}>
                                        <SelectTrigger className="h-10 text-xs font-medium uppercase"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL" className="text-xs font-medium">Broadcast All</SelectItem>
                                            <SelectItem value="DEPARTMENT" className="text-xs font-medium">Filter Unit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {formData.target_type === 'DEPARTMENT' && (
                                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                                    <Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground ml-1">Pilih Unit Departemen</Label>
                                    <Select value={formData.department_id} onValueChange={v => setData('department_id', v)}>
                                        <SelectTrigger className="h-10 text-xs font-medium"><SelectValue placeholder="Target unit..." /></SelectTrigger>
                                        <SelectContent>
                                            {departments.map(d => (
                                                <SelectItem key={d.id} value={d.id} className="text-xs font-medium">{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="flex items-center gap-3 p-4 bg-muted/10 rounded-xl border border-border/40">
                                <div 
                                    onClick={() => setData('is_published', !formData.is_published)}
                                    className={cn(
                                        "size-6 rounded-md border transition-all flex items-center justify-center cursor-pointer",
                                        formData.is_published ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-muted-foreground/30 bg-background"
                                    )}
                                >
                                    {formData.is_published && <Check className="h-4 w-4 stroke-[3px]" />}
                                </div>
                                <div className="flex flex-col select-none cursor-pointer" onClick={() => setData('is_published', !formData.is_published)}>
                                    <span className="text-[11px] font-medium uppercase tracking-wider">Aktifkan Siaran Langsung</span>
                                    <span className="text-[9px] text-muted-foreground font-medium italic">
                                        {formData.is_published ? 'Karyawan akan menerima notifikasi segera.' : 'Simpan sebagai draft internal.'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-border/60 flex items-center justify-end gap-3 bg-muted/5">
                            <Button type="button" variant="ghost" className="h-10 text-xs font-medium uppercase tracking-wider" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); reset(); }}>Batal</Button>
                            <Button type="submit" disabled={processing} className="h-10 px-6 text-xs font-medium uppercase tracking-wider shadow-lg shadow-primary/10">
                                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Megaphone className="w-4 h-4 mr-2" />}
                                {isEditOpen ? 'Simpan Update' : 'Broadcast Sekarang'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
