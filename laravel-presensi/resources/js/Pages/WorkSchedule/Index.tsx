import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { PageProps } from "@/types";
import { Card } from "@/Components/ui/card";
import { toast } from "sonner";

// Partials
import WorkScheduleHeader from "./Partials/WorkScheduleHeader";
import WorkScheduleTabs from "./Partials/WorkScheduleTabs";
import ShiftTable from "./Partials/ShiftTable";
import ScheduleTable from "./Partials/ScheduleTable";
import ShiftModal from "./Partials/ShiftModal";
import ScheduleModal from "./Partials/ScheduleModal";
import MembersModal from "./Partials/MembersModal";
import Pagination from "./Partials/Pagination";

interface Shift {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    late_tolerance: number;
    grace_period_check_in: number;
    grace_period_check_out: number;
    minimum_work_hours: number;
    is_night_shift: boolean;
    status: boolean;
    users_count: number;
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
    tab: "shifts" | "schedules";
    filters: {
        search?: string;
        department_id?: string;
        shift_id?: string;
        date_from?: string;
        date_to?: string;
        tab?: string;
    };
    shifts: {
        id: string;
        name: string;
        start_time: string;
        end_time: string;
    }[];
    departments: { id: string; name: string }[];
    employees: { id: string; full_name: string; employee_id: string }[];
    role: string;
}

export default function Index({
    data,
    tab,
    filters,
    shifts,
    departments,
    employees,
    role,
}: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [isCreateShiftOpen, setIsCreateShiftOpen] = useState(false);
    const [isEditShiftOpen, setIsEditShiftOpen] = useState(false);
    const [isCreateSchedOpen, setIsCreateSchedOpen] = useState(false);
    const [isEditSchedOpen, setIsEditSchedOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [isMembersOpen, setIsMembersOpen] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ["data", "shifts"] });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const shiftForm = useForm({
        name: "",
        start_time: "",
        end_time: "",
        late_tolerance: 0,
        grace_period_check_in: 0,
        grace_period_check_out: 0,
        minimum_work_hours: 8,
        is_night_shift: false,
        status: true,
    });

    const schedForm = useForm({
        user_id: "",
        shift_id: "",
        date: "",
        start_time: "",
        end_time: "",
        notes: "",
    });

    const handleTabChange = (value: string) => {
        router.get(
            route("work-schedule"),
            { ...filters, tab: value, search: "" },
            { preserveState: false },
        );
    };

    const handleSearch = () => {
        router.get(
            route("work-schedule"),
            { ...filters, search, tab },
            { preserveState: true },
        );
    };

    const handleCreateShift = (e: React.FormEvent) => {
        e.preventDefault();
        shiftForm.post(route("work-schedule.shifts.store"), {
            onSuccess: () => {
                setIsCreateShiftOpen(false);
                shiftForm.reset();
                toast.success("Shift berhasil dibuat!");
            },
        });
    };

    const handleUpdateShift = (e: React.FormEvent) => {
        e.preventDefault();
        shiftForm.put(route("work-schedule.shifts.update", selectedItem.id), {
            onSuccess: () => {
                setIsEditShiftOpen(false);
                shiftForm.reset();
                toast.success("Shift berhasil diperbarui!");
            },
        });
    };

    const deleteShift = (id: string) => {
        if (confirm("Hapus jenis shift ini?")) {
            router.delete(route("work-schedule.shifts.destroy", id), {
                onSuccess: () => toast.success("Shift berhasil dihapus."),
            });
        }
    };

    const handleCreateSched = (e: React.FormEvent) => {
        e.preventDefault();
        schedForm.post(route("work-schedule.schedules.store"), {
            onSuccess: () => {
                setIsCreateSchedOpen(false);
                schedForm.reset();
                toast.success("Jadwal karyawan berhasil ditambahkan!");
            },
        });
    };

    const handleUpdateSched = (e: React.FormEvent) => {
        e.preventDefault();
        schedForm.put(
            route("work-schedule.schedules.update", selectedItem.id),
            {
                onSuccess: () => {
                    setIsEditSchedOpen(false);
                    schedForm.reset();
                    toast.success("Jadwal berhasil diperbarui!");
                },
            },
        );
    };

    const deleteSched = (id: string) => {
        if (confirm("Hapus jadwal kerja ini?")) {
            router.delete(route("work-schedule.schedules.destroy", id), {
                onSuccess: () => toast.success("Jadwal berhasil dihapus."),
            });
        }
    };

    const openShiftMembers = async (shift: Shift) => {
        setSelectedItem(shift);
        setIsMembersOpen(true);
        setLoadingMembers(true);
        try {
            const response = await axios.get(
                route("work-schedule.shifts.members", shift.id),
            );
            setMembers(response.data);
        } catch (error) {
            toast.error("Gagal memuat anggota shift.");
        } finally {
            setLoadingMembers(false);
        }
    };

    const formatTime = (time: string) =>
        time ? time.substring(0, 5) : "--:--";

    return (
        <AuthenticatedLayout>
            <Head title="Jadwal Kerja & Shift" />

            <div className="w-full space-y-4 sm:space-y-6">
                <WorkScheduleHeader
                    tab={tab}
                    role={role}
                    onAdd={() =>
                        tab === "shifts"
                            ? setIsCreateShiftOpen(true)
                            : setIsCreateSchedOpen(true)
                    }
                />

                <WorkScheduleTabs
                    tab={tab}
                    role={role}
                    search={search}
                    onTabChange={handleTabChange}
                    onSearchChange={setSearch}
                    onSearchSubmit={handleSearch}
                />

                <Card className="border-border/60 shadow-none overflow-hidden">
                    <div className="overflow-x-auto">
                        {tab === "shifts" ? (
                            <ShiftTable
                                items={data.data}
                                onEdit={(item) => {
                                    setSelectedItem(item);
                                    shiftForm.setData({
                                        name: item.name,
                                        start_time: item.start_time,
                                        end_time: item.end_time,
                                        late_tolerance: item.late_tolerance,
                                        grace_period_check_in:
                                            item.grace_period_check_in || 0,
                                        grace_period_check_out:
                                            item.grace_period_check_out || 0,
                                        minimum_work_hours:
                                            item.minimum_work_hours || 8,
                                        is_night_shift: item.is_night_shift,
                                        status: item.status,
                                    });
                                    setIsEditShiftOpen(true);
                                }}
                                onDelete={deleteShift}
                                onViewMembers={openShiftMembers}
                                formatTime={formatTime}
                            />
                        ) : (
                            <ScheduleTable
                                items={data.data}
                                onEdit={(item) => {
                                    setSelectedItem(item);
                                    schedForm.setData({
                                        user_id: item.user_id,
                                        shift_id: item.shift_id,
                                        date: item.date,
                                        start_time: item.start_time,
                                        end_time: item.end_time,
                                        notes: item.notes || "",
                                    });
                                    setIsEditSchedOpen(true);
                                }}
                                onDelete={deleteSched}
                                formatTime={formatTime}
                            />
                        )}
                    </div>

                    <Pagination
                        currentPage={data.current_page}
                        lastPage={data.last_page}
                        links={data.links}
                    />
                </Card>
            </div>

            <ShiftModal
                isOpen={isCreateShiftOpen || isEditShiftOpen}
                onOpenChange={(v) =>
                    !v &&
                    (setIsCreateShiftOpen(false), setIsEditShiftOpen(false))
                }
                isEdit={isEditShiftOpen}
                data={shiftForm.data}
                setData={shiftForm.setData}
                onSubmit={
                    isEditShiftOpen ? handleUpdateShift : handleCreateShift
                }
                processing={shiftForm.processing}
            />

            <ScheduleModal
                isOpen={isCreateSchedOpen || isEditSchedOpen}
                onOpenChange={(v) =>
                    !v &&
                    (setIsCreateSchedOpen(false), setIsEditSchedOpen(false))
                }
                isEdit={isEditSchedOpen}
                data={schedForm.data}
                setData={schedForm.setData}
                onSubmit={
                    isEditSchedOpen ? handleUpdateSched : handleCreateSched
                }
                processing={schedForm.processing}
                employees={employees}
                shifts={shifts}
            />

            <MembersModal
                isOpen={isMembersOpen}
                onOpenChange={setIsMembersOpen}
                shiftName={selectedItem?.name}
                members={members}
                loading={loadingMembers}
            />
        </AuthenticatedLayout>
    );
}
