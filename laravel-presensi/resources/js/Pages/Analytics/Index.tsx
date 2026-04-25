import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { PageProps } from "@/types";
import { Tabs, TabsContent } from "@/Components/ui/tabs";

// Partials
import AnalyticsHeader from "./Partials/AnalyticsHeader";
import AnalyticsFilters from "./Partials/AnalyticsFilters";
import StatCards from "./Partials/StatCards";
import PerformanceTable from "./Partials/PerformanceTable";
import AuditLogTable from "./Partials/AuditLogTable";
import ResearchReportTable from "./Partials/ResearchReportTable";
import ResearchSummaryCards from "./Partials/ResearchSummaryCards";

interface Props extends PageProps {
    data: any;
    tab: "reports" | "activity" | "research";
    totalStats: {
        attendance: number;
        late: number;
        leave: number;
        absent: number;
        hours: number;
    };
    filters: {
        start_date: string;
        end_date: string;
        department_id?: string;
        employee_id?: string;
        search?: string;
        module?: string;
        tab: string;
    };
    departments: { id: string; name: string }[];
    employeeList: { id: string; full_name: string }[];
    researchSummary?: {
        accuracy: string;
        avg_duration: string;
        model_version: string;
        total_tests: number;
    };
    role: string;
}

export default function Index({
    data,
    tab,
    totalStats,
    filters,
    departments,
    employeeList,
    researchSummary = {
        accuracy: "0%",
        avg_duration: "0s",
        model_version: "V1.0",
        total_tests: 0
    },
    role,
}: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [localFilters, setLocalFilters] = useState(filters);

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ["data", "totalStats", "researchSummary"] });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleTabChange = (value: string) => {
        router.get(route("analytics"), { ...filters, tab: value }, { preserveState: false });
    };

    const applyFilters = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(route("analytics"), { ...localFilters, search, tab }, { preserveState: true });
    };

    const handleExport = () => {
        const url = tab === "reports" ? route("analytics.export.report") : tab === "activity" ? route("analytics.export.logs") : route("analytics.export.research");
        const params = new URLSearchParams(localFilters as any).toString();
        window.location.href = `${url}?${params}`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Analisis & Insight" />

            <div className="w-full space-y-4">
                <AnalyticsHeader onExport={handleExport} />

                <Tabs value={tab} onValueChange={handleTabChange} className="w-full space-y-4">
                    <AnalyticsFilters 
                        startDate={localFilters.start_date}
                        endDate={localFilters.end_date}
                        onDateChange={(type, val) => setLocalFilters({ ...localFilters, [type === 'start' ? 'start_date' : 'end_date']: val })}
                        onApply={applyFilters}
                    />

                    <TabsContent value="reports" className="space-y-4">
                        <StatCards stats={totalStats} />
                        <PerformanceTable 
                            data={data}
                            search={search}
                            onSearchChange={setSearch}
                            onSearchSubmit={applyFilters}
                            departmentId={localFilters.department_id || ""}
                            onDepartmentChange={(v) => setLocalFilters({ ...localFilters, department_id: v === "all" ? "" : v })}
                            departments={departments}
                            role={role}
                        />
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-4">
                        <AuditLogTable 
                            data={data}
                            search={search}
                            onSearchChange={setSearch}
                        />
                    </TabsContent>

                    <TabsContent value="research" className="space-y-4">
                        <ResearchReportTable data={data} />
                        <ResearchSummaryCards summary={researchSummary} />
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
