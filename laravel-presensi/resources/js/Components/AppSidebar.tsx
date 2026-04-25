import * as React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    IconInnerShadowTop,
    IconLayoutDashboard,
    IconBuilding,
    IconUsers,
    IconSettings,
    IconSpeakerphone,
    IconCalendarEvent,
    IconFileText,
    IconHierarchy,
    IconChartBar,
    IconClock,
    IconFingerprint,
    IconLogout,
    type Icon,
} from "@tabler/icons-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupContent,
} from "@/Components/ui/sidebar";

/* ============================= */
/*              TYPES            */
/* ============================= */

type Role = "SUPERADMIN" | "OWNER" | "MANAGER" | "EMPLOYEE";

interface SidebarUser {
    id: string | number;
    full_name: string;
    personal_email: string;
    role: Role;
    profile_photo?: string;
    company?: {
        company_name: string;
    };
}

type MainNavItem = {
    title: string;
    url: string;
    icon: Icon;
};

type SidebarData = {
    navMain: MainNavItem[];
};

/* ============================= */
/*      ROLE BADGE LABELS        */
/* ============================= */

const ROLE_LABEL: Record<Role, string> = {
    SUPERADMIN: "Super Admin",
    OWNER: "Owner",
    MANAGER: "Manager",
    EMPLOYEE: "Karyawan",
};

const ROLE_COLOR: Record<Role, string> = {
    SUPERADMIN: "bg-rose-500/20 text-rose-300 ring-rose-500/30",
    OWNER: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
    MANAGER: "bg-sky-500/20 text-sky-300 ring-sky-500/30",
    EMPLOYEE: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
};

/* ============================= */
/*           NAV MAIN            */
/* ============================= */

function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: Icon;
    }[];
}) {
    const { url } = usePage();

    return (
        <SidebarGroup className="px-2">
            <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                    {items.map((item) => {
                        const currentPath =
                            url.split("?")[0].replace(/\/$/, "") || "/";
                        const targetPath = item.url.replace(/\/$/, "") || "/";

                        const isActive =
                            targetPath === "/"
                                ? currentPath === "/"
                                : currentPath === targetPath ||
                                  currentPath.startsWith(`${targetPath}/`);

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={item.title}
                                    className={`
                                        group relative flex items-center gap-3 px-3 py-5 rounded-xl transition-all duration-300
                                        ${
                                            isActive
                                                ? "bg-amber-50 shadow-sm text-amber-900"
                                                : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
                                        }
                                    `}
                                >
                                    <Link href={item.url}>
                                        {/* Active background glow */}
                                        {isActive && (
                                            <span className="absolute inset-0 bg-gradien÷t-to-r from-amber-500/5 via-transparent to-transparent rounded-xl" />
                                        )}
                                        
                                        {/* Active left indicator */}
                                        {isActive && (
                                            <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                                        )}

                                        {item.icon && (
                                            <item.icon
                                                className={`size-5 shrink-0 transition-all duration-300 ${
                                                    isActive
                                                        ? "text-amber-600"
                                                        : "text-slate-400 group-hover:text-slate-600"
                                                }`}
                                            />
                                        )}

                                        <span className={`text-sm tracking-wide truncate flex-1 ${isActive ? "font-bold" : "font-medium"}`}>
                                            {item.title}
                                        </span>

                                        {isActive && (
                                            <div className="size-1.5 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)] ml-auto" />
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

/* ============================= */
/*        ROLE NAV CONFIG        */
/* ============================= */

const NAV_CONFIG: Record<Role, SidebarData> = {
    SUPERADMIN: {
        navMain: [
            {
                title: "Dashboard",
                url: "/superadmin/dashboard",
                icon: IconLayoutDashboard,
            },
            {
                title: "Monitoring Global",
                url: "/superadmin/management",
                icon: IconBuilding,
            },
            {
                title: "Insights & Analytics",
                url: "/superadmin/analytics",
                icon: IconChartBar,
            },
            {
                title: "Account & System Settings",
                url: "/superadmin/settings",
                icon: IconSettings,
            },
            {
                title: "Communication Center",
                url: "/superadmin/communication",
                icon: IconSpeakerphone,
            },
        ],
    },
    OWNER: {
        navMain: [
            {
                title: "Dashboard",
                url: "/owner/dashboard",
                icon: IconLayoutDashboard,
            },
            {
                title: "Monitoring Presensi",
                url: "/owner/attendance",
                icon: IconCalendarEvent,
            },
            { title: "Pengajuan", url: "/owner/requests", icon: IconFileText },
            { title: "Karyawan", url: "/owner/employees", icon: IconUsers },
            {
                title: "Organisasi",
                url: "/owner/organization",
                icon: IconHierarchy,
            },
            {
                title: "Jadwal Kerja",
                url: "/owner/work-schedule",
                icon: IconClock,
            },
            {
                title: "Communication Center",
                url: "/owner/communication",
                icon: IconSpeakerphone,
            },
            {
                title: "Hari Libur",
                url: "/owner/holidays",
                icon: IconCalendarEvent,
            },
            {
                title: "Insights & Analytics",
                url: "/owner/analytics",
                icon: IconChartBar,
            },
            {
                title: "Account & System Settings",
                url: "/owner/settings",
                icon: IconSettings,
            },
        ],
    },
    MANAGER: {
        navMain: [
            {
                title: "Dashboard",
                url: "/manager/dashboard",
                icon: IconLayoutDashboard,
            },
            {
                title: "Absensi Hari Ini",
                url: "/manager/checkincheckout",
                icon: IconFingerprint,
            },
            {
                title: "Monitoring Presensi",
                url: "/manager/attendance",
                icon: IconCalendarEvent,
            },
            {
                title: "Pengajuan",
                url: "/manager/requests",
                icon: IconFileText,
            },
            {
                title: "Karyawan Tim",
                url: "/manager/employees",
                icon: IconUsers,
            },
            {
                title: "Organisasi",
                url: "/manager/organization",
                icon: IconHierarchy,
            },
            {
                title: "Jadwal Kerja",
                url: "/manager/work-schedule",
                icon: IconClock,
            },
            {
                title: "Communication Center",
                url: "/manager/communication",
                icon: IconSpeakerphone,
            },
            {
                title: "Insights Departemen",
                url: "/manager/analytics",
                icon: IconChartBar,
            },
            {
                title: "Account Settings",
                url: "/manager/settings",
                icon: IconSettings,
            },
        ],
    },
    EMPLOYEE: {
        navMain: [
            {
                title: "Dashboard",
                url: "/employee/dashboard",
                icon: IconLayoutDashboard,
            },
            {
                title: "Absensi Hari Ini",
                url: "/employee/checkincheckout",
                icon: IconFingerprint,
            },
            {
                title: "Riwayat Presensi",
                url: "/employee/attendance",
                icon: IconCalendarEvent,
            },
            {
                title: "Pengajuan Saya",
                url: "/employee/requests",
                icon: IconFileText,
            },
            {
                title: "Communication Center",
                url: "/employee/communication",
                icon: IconSpeakerphone,
            },
            {
                title: "Jadwal Saya",
                url: "/employee/work-schedule",
                icon: IconClock,
            },
            {
                title: "Insights Saya",
                url: "/employee/analytics",
                icon: IconChartBar,
            },
            {
                title: "Account Settings",
                url: "/employee/settings",
                icon: IconSettings,
            },
        ],
    },
};

/* ============================= */
/*           NAV USER            */
/* ============================= */


/* ============================= */
/*        ROLE NAV CONFIG        */
/* ============================= */


/* ============================= */
/*        MAIN COMPONENT         */
/* ============================= */

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const user = usePage().props.auth.user as SidebarUser;

    const role: Role =
        user?.role &&
        ["SUPERADMIN", "OWNER", "MANAGER", "EMPLOYEE"].includes(user.role)
            ? (user.role as Role)
            : "EMPLOYEE";

    const navData = NAV_CONFIG[role];

    const sidebarUser = {
        id: user?.id,
        name: user?.full_name || "User",
        email: user?.personal_email || "user@example.com",
        avatar: user?.profile_photo || "",
        role: user?.role || "EMPLOYEE",
    };

    return (
        <Sidebar
            collapsible="offcanvas"
            className="border-r border-slate-100 bg-white"
            style={
                {
                    "--sidebar-background": "#ffffff",
                } as React.CSSProperties
            }
            {...props}
        >
            {/*
             * We use a wrapping div for the actual sidebar panel styling
             * so we can apply the white background, border, and subtle texture.
             */}
            <div className="flex flex-col h-full bg-white border-r border-slate-100">
                {/* ── HEADER ── */}
                <SidebarHeader className="px-4 pt-5 pb-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                asChild
                                className="hover:bg-transparent px-0"
                            >
                                <Link
                                    href={navData.navMain[0].url}
                                    className="flex items-center gap-4 group/logo"
                                >
                                    {/* Logo mark */}
                                    <div
                                        className="
                                        relative flex size-10 items-center justify-center
                                        rounded-2xl shrink-0
                                        bg-linear-to-br from-amber-400 to-amber-600
                                        shadow-lg shadow-amber-500/30
                                        transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-3
                                    "
                                    >
                                        <IconInnerShadowTop className="size-5 text-white drop-shadow-sm" />
                                        {/* Glossy overlay */}
                                        <span className="absolute inset-0 rounded-2xl bg-linear-to-t 0" />
                                    </div>

                                    <div className="flex flex-col leading-tight">
                                        <span className="text-base font-black text-slate-900 tracking-tight group-hover/logo:text-amber-600 transition-colors">
                                            {user?.company?.company_name ||
                                                "Sikawan HR"}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-0.5">
                                            Management
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>


                </SidebarHeader>

                {/* ── Divider ── */}
                <div className="mx-4 h-px bg-slate-100" />

                {/* ── NAVIGATION ── */}
                <SidebarContent className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-none">
                    <NavMain items={navData.navMain} />
                </SidebarContent>

                {/* ── FOOTER ── */}
                <SidebarFooter className="p-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => router.post(route("logout"))}
                                className="w-full h-11 px-4 rounded-xl flex items-center gap-3 bg-white border border-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all duration-300 group shadow-sm"
                            >
                                <div className="size-8 flex items-center justify-center rounded-lg bg-white border border-slate-100 group-hover:bg-rose-100 group-hover:border-rose-200 transition-colors">
                                    <IconLogout className="size-4 text-slate-400 group-hover:text-rose-600" />
                                </div>
                                <span className="text-sm font-bold tracking-tight">Keluar Sesi</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </div>
        </Sidebar>
    );
}
