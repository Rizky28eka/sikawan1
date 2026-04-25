import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import * as React from "react";
import { 
    Building2, 
    Users, 
    MapPin, 
    Eye, 
    Mail, 
    Phone, 
    Globe, 
    Activity, 
    Shield, 
    CheckCircle2, 
    XCircle 
} from "lucide-react";

import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
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

/* ============================= */
/*           INTERFACES          */
/* ============================= */

interface Company {
    id: string;
    company_name: string;
    company_code: string;
    company_email: string;
    company_phone: string;
    company_address: string;
    status: boolean;
    working_start: string;
    working_end: string;
    timezone: string;
    late_tolerance: number;
    auto_absent: boolean;
    enable_face_recognition: boolean;
    enable_geofencing: boolean;
    session_timeout: number;
    notify_leave_request: boolean;
    notify_attendance_reminder: boolean;
    notify_system_activity: boolean;
    users_count: number;
    site_count: number;
    created_at: string;
    users?: Array<{
        id: string;
        full_name: string;
        personal_email: string;
        role: string;
        status: boolean;
    }>;
    sites?: Array<{
        id: string;
        name: string;
        address: string;
        status: boolean;
    }>;
}

interface User {
    id: string;
    full_name: string;
    personal_email: string;
    role: string;
    company_id: string | null;
    status: boolean;
    created_at: string;
    company?: {
        company_name: string;
    };
}

interface Device {
    id: string;
    name: string;
    brand: string;
    model: string;
    os_version: string;
    app_version: string;
    last_active: string;
    status: boolean;
    device_status: string;
    is_rooted_jailbroken: boolean;
    ip_address: string;
    battery_level: number;
}

interface Props {
    auth: any;
    companies?: Company[];
    users?: { data: User[] };
    devices?: Device[];
}

/* ============================= */
/*       SUB-COMPONENTS          */
/* ============================= */

const CompanyTab = ({ companies }: { companies: Company[] }) => {
    const [selectedCompany, setSelectedCompany] =
        React.useState<Company | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleViewDetail = (company: Company) => {
        setSelectedCompany(company);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-medium tracking-tight">
                        Monitoring Perusahaan
                    </h1>
                    <p className="text-sm text-muted-foreground font-light">
                        Pantau status operasional dan statistik tenant secara
                        global.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="border-none bg-indigo-50/50 shadow-none">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-indigo-600/70 font-medium">
                                Total Perusahaan
                            </p>
                            <p className="text-2xl font-bold text-indigo-900">
                                {companies.length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-emerald-50/50 shadow-none">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-emerald-600/70 font-medium">
                                Global Employees
                            </p>
                            <p className="text-2xl font-bold text-emerald-900">
                                {companies.reduce(
                                    (a, c) => a + c.users_count,
                                    0,
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-amber-50/50 shadow-none">
                    <CardContent className="flex items-center gap-4 p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-lg shadow-amber-200">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-amber-600/70 font-medium">
                                Total Sites
                            </p>
                            <p className="text-2xl font-bold text-amber-900">
                                {companies.reduce(
                                    (a, c) => a + c.site_count,
                                    0,
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="overflow-hidden border-none bg-background shadow-2xl shadow-gray-200/50">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/5">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="h-12 pl-6 text-[10px] uppercase font-bold tracking-widest">
                                    Detail Perusahaan
                                </TableHead>
                                <TableHead className="h-12 text-[10px] uppercase font-bold tracking-widest text-center text-muted-foreground">
                                    Status
                                </TableHead>
                                <TableHead className="h-12 pr-6 text-right text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                    Aksi Monitoring
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {companies.map((company) => (
                                <TableRow
                                    key={company.id}
                                    className="border-b border-muted/30 last:border-none hover:bg-muted/5 transition-colors"
                                >
                                    <TableCell className="py-5 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary font-bold text-lg">
                                                {company.company_name.charAt(0)}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-bold leading-none">
                                                    {company.company_name}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">
                                                    Code: {company.company_code}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            className={`${company.status ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"} border-none px-3 py-1 rounded-full text-[10px] uppercase font-bold`}
                                        >
                                            {company.status
                                                ? "Active"
                                                : "Suspended"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pr-6 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleViewDetail(company)
                                            }
                                            className="h-9 rounded-xl border-slate-200 hover:bg-slate-50 gap-2"
                                        >
                                            <Eye className="h-3.5 w-3.5" />{" "}
                                            Detail Perusahaan
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[750px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-white">
                    <div className="bg-primary p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Building2 size={120} />
                        </div>
                        <DialogHeader className="relative z-10 text-left">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl font-black shadow-inner">
                                    {selectedCompany?.company_name.charAt(0)}
                                </div>
                                <div>
                                    <DialogTitle className="text-3xl font-bold tracking-tight text-white">{selectedCompany?.company_name}</DialogTitle>
                                    <DialogDescription className="text-white/70 font-mono text-xs uppercase tracking-widest mt-1">Tenant ID: {selectedCompany?.company_code}</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    {selectedCompany && (
                        <Tabs defaultValue="info" className="w-full">
                            <div className="px-8 mt-4 border-b">
                                <TabsList className="bg-transparent h-12 p-0 gap-6">
                                    <TabsTrigger value="info" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 text-xs font-bold uppercase tracking-wider">Konfigurasi</TabsTrigger>
                                    <TabsTrigger value="users" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 text-xs font-bold uppercase tracking-wider">Pengguna ({selectedCompany.users_count})</TabsTrigger>
                                    <TabsTrigger value="sites" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 text-xs font-bold uppercase tracking-wider">Sites ({selectedCompany.site_count})</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="info" className="p-8 pt-6 space-y-8 max-h-[50vh] overflow-y-auto scrollbar-hide">
                                 {/* ── SEKSI 1: IDENTITAS & KONTAK ── */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        <Globe className="h-4 w-4" /> Identitas & Lokasi
                                    </h4>
                                    <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Bisnis</p>
                                            <p className="text-sm font-semibold text-slate-900">{selectedCompany.company_email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telepon</p>
                                            <p className="text-sm font-semibold text-slate-900">{selectedCompany.company_phone}</p>
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Kantor</p>
                                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{selectedCompany.company_address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── SEKSI 2: KONFIGURASI OPERASIONAL ── */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        <Activity className="h-4 w-4" /> Sistem Operasional
                                    </h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Jam Kerja</p>
                                            <p className="text-sm font-bold text-slate-900">{selectedCompany.working_start} - {selectedCompany.working_end}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Late Tol.</p>
                                            <p className="text-sm font-bold text-slate-900">{selectedCompany.late_tolerance}m</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Session</p>
                                            <p className="text-sm font-bold text-slate-900">{selectedCompany.session_timeout}m</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── SEKSI 3: KEAMANAN ── */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        <Shield className="h-4 w-4" /> Security Features
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                                            <span className="text-xs font-medium">Face Recognition</span>
                                            {selectedCompany.enable_face_recognition ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                                            <span className="text-xs font-medium">Geofencing</span>
                                            {selectedCompany.enable_geofencing ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="users" className="p-8 pt-0 max-h-[50vh] overflow-y-auto">
                                <div className="border border-slate-100 rounded-2xl overflow-hidden mt-6">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead className="text-[10px] font-bold uppercase">Nama Pengguna</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase">Role</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase text-right">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedCompany.users?.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="py-3">
                                                        <p className="text-sm font-bold">{user.full_name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{user.personal_email}</p>
                                                    </TableCell>
                                                    <TableCell><Badge variant="outline" className="text-[9px] font-bold font-mono">{user.role}</Badge></TableCell>
                                                    <TableCell className="text-right">{user.status ? <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" /> : <XCircle className="h-4 w-4 text-rose-500 ml-auto" />}</TableCell>
                                                </TableRow>
                                            ))}
                                            {(!selectedCompany.users || selectedCompany.users.length === 0) && (
                                                <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-xs italic">Belum ada pengguna terdaftar.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="sites" className="p-8 pt-0 max-h-[50vh] overflow-y-auto">
                                <div className="space-y-3 mt-6">
                                    {selectedCompany.sites?.map((site) => (
                                        <div key={site.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600"><MapPin className="h-5 w-5" /></div>
                                                <div>
                                                    <p className="text-sm font-bold">{site.name}</p>
                                                    <p className="text-[10px] text-muted-foreground italic line-clamp-1">{site.address}</p>
                                                </div>
                                            </div>
                                            {site.status ? <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase">Active Site</Badge> : <Badge className="bg-slate-50 text-slate-400 border-none text-[8px] font-black uppercase">Inactive</Badge>}
                                        </div>
                                    ))}
                                    {(!selectedCompany.sites || selectedCompany.sites.length === 0) && (
                                        <div className="text-center py-12 text-muted-foreground text-xs italic">Belum ada lokasi kantor terdaftar.</div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}

                    <DialogFooter className="p-8 border-t bg-slate-50/50">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full h-12 rounded-2xl font-bold border-slate-200 hover:bg-slate-100 transition-all text-slate-600">Selesai Inspeksi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

/* ============================= */
/*       MAIN MANAGEMENT PAGE    */
/* ============================= */

export default function Management({
    auth,
    companies = [],
    users = { data: [] },
    devices = [],
}: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="SuperAdmin Monitoring" />

            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
                {/* ── Section Perusahaan ── */}
                <section id="companies">
                    <CompanyTab companies={companies} />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
