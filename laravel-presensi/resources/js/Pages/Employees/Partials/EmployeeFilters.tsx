import { Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Department, Site } from "./types";

interface EmployeeFiltersProps {
    search: string;
    setSearch: (val: string) => void;
    filters: any;
    handleSearch: (e?: React.FormEvent) => void;
    handleFilterChange: (key: string, value: string) => void;
    resetFilters: () => void;
    isFilterOpen: boolean;
    setIsFilterOpen: (val: boolean) => void;
    departments: Department[];
    sites: Site[];
}

export default function EmployeeFilters({
    search,
    setSearch,
    filters,
    handleSearch,
    handleFilterChange,
    resetFilters,
    isFilterOpen,
    setIsFilterOpen,
    departments,
    sites,
}: EmployeeFiltersProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="hidden lg:block lg:w-auto" />
                {/* Search field moved out of TabsList in Index but handled here logic-wise */}
                <div className="flex w-full items-center gap-2 md:w-auto">
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full items-center gap-2"
                    >
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari karyawan..."
                                className="h-10 sm:h-11 w-full pl-9 md:w-[250px] lg:w-[350px] border-border/60 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </form>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 sm:h-11 w-10 sm:w-11 shrink-0 border-border/60"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isFilterOpen && (
                <Card>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Departemen</Label>
                                <Select
                                    value={filters.department_id || "all"}
                                    onValueChange={(val) =>
                                        handleFilterChange(
                                            "department_id",
                                            val === "all" ? "" : val,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih departemen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua
                                        </SelectItem>
                                        {departments.map((dept) => (
                                            <SelectItem
                                                key={dept.id}
                                                value={dept.id}
                                            >
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={filters.status || "all"}
                                    onValueChange={(val) =>
                                        handleFilterChange(
                                            "status",
                                            val === "all" ? "" : val,
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-10 text-xs font-medium uppercase">
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="all"
                                            className="text-xs font-medium"
                                        >
                                            Semua Status
                                        </SelectItem>
                                        <SelectItem
                                            value="active"
                                            className="text-xs font-medium"
                                        >
                                            Aktif
                                        </SelectItem>
                                        <SelectItem
                                            value="inactive"
                                            className="text-xs font-medium"
                                        >
                                            Nonaktif
                                        </SelectItem>
                                        <SelectItem
                                            value="resigned"
                                            className="text-xs font-medium text-rose-500"
                                        >
                                            Resigned
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Role Akses</Label>
                                <Select
                                    value={filters.role || "all"}
                                    onValueChange={(val) =>
                                        handleFilterChange(
                                            "role",
                                            val === "all" ? "" : val,
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-10 text-xs font-medium uppercase">
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="all"
                                            className="text-xs font-medium"
                                        >
                                            Semua Role
                                        </SelectItem>
                                        <SelectItem
                                            value="OWNER"
                                            className="text-xs font-medium"
                                        >
                                            OWNER
                                        </SelectItem>
                                        <SelectItem
                                            value="MANAGER"
                                            className="text-xs font-medium"
                                        >
                                            MANAGER
                                        </SelectItem>
                                        <SelectItem
                                            value="EMPLOYEE"
                                            className="text-xs font-medium"
                                        >
                                            EMPLOYEE
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Site Lokasi</Label>
                                <Select
                                    value={filters.site_id || "all"}
                                    onValueChange={(val) =>
                                        handleFilterChange(
                                            "site_id",
                                            val === "all" ? "" : val,
                                        )
                                    }
                                >
                                    <SelectTrigger className="h-10 text-xs font-medium uppercase">
                                        <SelectValue placeholder="Pilih Lokasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="all"
                                            className="text-xs font-medium"
                                        >
                                            Semua Lokasi
                                        </SelectItem>
                                        {sites.map((site) => (
                                            <SelectItem
                                                key={site.id}
                                                value={site.id}
                                                className="text-xs font-medium"
                                            >
                                                {site.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={resetFilters}
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={() => handleSearch()}
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Terapkan
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
