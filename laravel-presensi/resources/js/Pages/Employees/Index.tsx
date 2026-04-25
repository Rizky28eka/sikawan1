import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { User, Invitation, Department, Site } from "./Partials/types";
import EmployeeHeader from "./Partials/EmployeeHeader";
import EmployeeFilters from "./Partials/EmployeeFilters";
import EmployeeTable from "./Partials/EmployeeTable";
import InvitationTable from "./Partials/InvitationTable";
import InviteModal from "./Partials/Modals/InviteModal";
import EditModal from "./Partials/Modals/EditModal";
import ViewModal from "./Partials/Modals/ViewModal";
import FaceRegistrationModal from "./Partials/Modals/FaceRegistrationModal";
import DeleteConfirmationDialog from "./Partials/Modals/DeleteConfirmationDialog";

interface Props {
    employees: {
        data: User[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    invitations: Invitation[];
    departments: Department[];
    sites: Site[];
    filters: any;
    shifts: any[];
    managers: any[];
}

export default function Index({
    employees,
    invitations,
    departments,
    sites,
    filters: initialFilters,
    shifts,
    managers,
}: Props) {
    const { auth } = usePage().props as any;
    const auth_user = auth.user;

    // --- State ---
    const [search, setSearch] = useState(initialFilters.search || "");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState("list");

    // Modal states
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [faceModalUser, setFaceModalUser] = useState<User | null>(null);

    // --- Handlers ---
    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            route(auth_user.role.toLowerCase() + ".employees"),
            { ...initialFilters, search },
            { preserveState: true },
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            route(auth_user.role.toLowerCase() + ".employees"),
            { ...initialFilters, [key]: value, page: 1 },
            { preserveState: true },
        );
    };

    const resetFilters = () => {
        setSearch("");
        router.get(
            route(auth_user.role.toLowerCase() + ".employees"),
            {},
            { preserveState: true },
        );
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    // Polling for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ["employees", "invitations"] });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Karyawan" />

            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                <EmployeeHeader
                    onInviteClick={() => setIsInviteModalOpen(true)}
                />

                <Tabs
                    value={selectedTab}
                    onValueChange={setSelectedTab}
                    className="space-y-6"
                >
                    <div className="flex flex-col gap-4 border-b pb-1 sm:flex-row sm:items-center sm:justify-between">
                        <TabsList className="h-auto w-full justify-start gap-1 bg-transparent p-0 sm:w-auto">
                            <TabsTrigger
                                value="list"
                                className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
                            >
                                Daftar Karyawan
                            </TabsTrigger>
                            <TabsTrigger
                                value="invitations"
                                className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
                            >
                                Undangan
                                {invitations.length > 0 && (
                                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                        {invitations.length}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        {selectedTab === "list" && (
                            <EmployeeFilters
                                search={search}
                                setSearch={setSearch}
                                filters={initialFilters}
                                handleSearch={handleSearch}
                                handleFilterChange={handleFilterChange}
                                resetFilters={resetFilters}
                                isFilterOpen={isFilterOpen}
                                setIsFilterOpen={setIsFilterOpen}
                                departments={departments}
                                sites={sites}
                            />
                        )}
                    </div>

                    <TabsContent value="list" className="mt-0 space-y-4">
                        <EmployeeTable
                            employees={employees}
                            onViewClick={(user) => {
                                setSelectedUser(user);
                                setIsViewModalOpen(true);
                            }}
                            onEditClick={handleEdit}
                            onDeleteClick={(user) => {
                                setUserToDelete(user);
                                setIsDeleteDialogOpen(true);
                            }}
                            onFaceRegistrationClick={(user) => {
                                setFaceModalUser(user);
                                setIsFaceModalOpen(true);
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="invitations" className="mt-0 space-y-4">
                        <InvitationTable invitations={invitations} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modals */}
            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={setIsInviteModalOpen}
                departments={departments}
                sites={sites}
                shifts={shifts}
                managers={managers}
                authUser={auth_user}
            />

            <EditModal
                isOpen={isEditModalOpen}
                onClose={setIsEditModalOpen}
                user={selectedUser}
                departments={departments}
                sites={sites}
                shifts={shifts}
                managers={managers}
                authUser={auth_user}
            />

            <ViewModal
                isOpen={isViewModalOpen}
                onClose={setIsViewModalOpen}
                user={selectedUser}
                onEditClick={handleEdit}
            />

            <FaceRegistrationModal
                isOpen={isFaceModalOpen}
                onClose={setIsFaceModalOpen}
                user={faceModalUser}
            />

            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={setIsDeleteDialogOpen}
                user={userToDelete}
            />
        </AuthenticatedLayout>
    );
}
