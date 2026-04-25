import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    KeyRound,
    UserCircle,
    Zap,
} from "lucide-react";
import ProfileSection from "./Partials/ProfileSection";
import SecuritySection from "./Partials/SecuritySection";
import SystemSection from "./Partials/SystemSection";

interface Props extends PageProps {
    user: any;
    role: string;
    tab: string;
    system_settings?: any;
    company?: any;
}

export default function Index({
    user,
    role,
    tab,
    system_settings,
    company,
}: Props) {
    const handleTabChange = (value: string) => {
        router.get(
            route("account-settings"),
            { tab: value },
            { preserveState: false },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan Akun" />

            <div className="w-full space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-semibold sm:text-2xl">
                            Pengaturan Akun & Sistem
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola profil, keamanan akun, dan konfigurasi dasar
                            perusahaan.
                        </p>
                    </div>
                </div>

                <Tabs
                    value={tab}
                    onValueChange={handleTabChange}
                    className="w-full space-y-4"
                >
                    {/* Tab list */}
                    <div>
                        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
                            <TabsTrigger
                                value="profile"
                                className="flex-1 sm:flex-none"
                            >
                                <UserCircle className="mr-2 h-4 w-4" /> Profil
                            </TabsTrigger>
                            <TabsTrigger
                                value="security"
                                className="flex-1 sm:flex-none"
                            >
                                <KeyRound className="mr-2 h-4 w-4" /> Keamanan
                            </TabsTrigger>
                            {(role === "SUPERADMIN" || role === "OWNER") && (
                                <TabsTrigger
                                    value="system"
                                    className="flex-1 sm:flex-none"
                                >
                                    <Zap className="mr-2 h-4 w-4" /> Konfigurasi
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>

                    {/* Profile tab */}
                    <TabsContent value="profile" className="space-y-4">
                        <ProfileSection user={user} role={role} />
                    </TabsContent>

                    {/* Security tab */}
                    <TabsContent value="security" className="space-y-4">
                        <SecuritySection user={user} />
                    </TabsContent>

                    {/* System config tab */}
                    <TabsContent value="system" className="space-y-4">
                        <SystemSection
                            role={role}
                            company={company}
                            system_settings={system_settings}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
