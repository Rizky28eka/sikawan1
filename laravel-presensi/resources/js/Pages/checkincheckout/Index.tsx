import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import AttendanceHeader from "./Partials/AttendanceHeader";
import ExemptCard from "./Partials/ExemptCard";
import AttendanceForm from "./Partials/AttendanceForm";
import AttendanceInfo from "./Partials/AttendanceInfo";

interface Props extends PageProps {
    user: any;
    site: any;
    shift: any;
    todayAttendance: any;
    isExempt?: boolean;
}

export default function AttendanceCheck({
    user,
    todayAttendance,
    isExempt,
    site,
    shift,
}: Props) {
    // Determine attendance type for header
    const suggestedType = !todayAttendance
        ? "CLOCK_IN"
        : todayAttendance.type === "CLOCK_IN"
          ? "CLOCK_OUT"
          : "FINISHED";

    const displayType =
        suggestedType === "FINISHED" ? "CLOCK_OUT" : suggestedType;

    return (
        <AuthenticatedLayout>
            <Head title="Presensi Biometrik" />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
                <AttendanceHeader
                    type={displayType}
                    siteName={site?.name}
                    shiftName={shift?.name}
                />

                {isExempt ? (
                    <ExemptCard userRole={user.role} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-12">
                            <Tabs defaultValue="attendance" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                                    <TabsTrigger value="attendance">
                                        Presensi Sekarang
                                    </TabsTrigger>
                                    <TabsTrigger value="history">
                                        Informasi
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="attendance"
                                    className="mt-6 space-y-8"
                                >
                                    <AttendanceForm
                                        user={user}
                                        site={site}
                                        todayAttendance={todayAttendance}
                                    />
                                </TabsContent>

                                <TabsContent value="history" className="mt-6">
                                    <AttendanceInfo shift={shift} site={site} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
