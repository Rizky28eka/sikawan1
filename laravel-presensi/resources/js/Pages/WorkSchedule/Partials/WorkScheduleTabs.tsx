import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Search, CalendarDays, Clock } from "lucide-react";

interface Props {
    tab: "shifts" | "schedules";
    role: string;
    search: string;
    onTabChange: (value: string) => void;
    onSearchChange: (value: string) => void;
    onSearchSubmit: () => void;
}

export default function WorkScheduleTabs({
    tab,
    role,
    search,
    onTabChange,
    onSearchChange,
    onSearchSubmit,
}: Props) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs
                value={tab}
                onValueChange={onTabChange}
                className="w-full sm:w-auto"
            >
                <TabsList className="h-10 sm:h-11 p-1 bg-muted/50 border-none w-full sm:w-auto overflow-x-auto justify-start no-scrollbar">
                    <TabsTrigger
                        value="schedules"
                        className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-5 data-[state=active]:bg-background font-medium"
                    >
                        <CalendarDays className="h-3.5 w-3.5 mr-2" /> Jadwal
                        Harian
                    </TabsTrigger>
                    {role !== "EMPLOYEE" && (
                        <TabsTrigger
                            value="shifts"
                            className="h-8 sm:h-9 text-[11px] sm:text-xs px-3 sm:px-5 data-[state=active]:bg-background font-medium"
                        >
                            <Clock className="h-3.5 w-3.5 mr-2" /> Master Shift
                        </TabsTrigger>
                    )}
                </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder={`Cari nama karyawan...`}
                        className="pl-9 h-10 sm:h-11 text-sm border-border/60 bg-background"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
                    />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-10 sm:h-11 w-10 sm:w-11 shrink-0 border-border/60"
                    onClick={onSearchSubmit}
                >
                    <Search className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
