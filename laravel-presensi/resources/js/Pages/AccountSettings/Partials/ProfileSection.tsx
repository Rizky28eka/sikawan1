import { useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import {
    Fingerprint,
    Globe,
    Smartphone,
    LayoutDashboard,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ProfileSectionProps {
    user: any;
    role: string;
}

export default function ProfileSection({ user, role }: ProfileSectionProps) {
    const profileForm = useForm({
        full_name: user.full_name || "",
        personal_email: user.personal_email || "",
        personal_phone: user.personal_phone || "",
    });

    const updateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post(route("account-settings.profile.update"), {
            onSuccess: () => toast.success("Profil Anda berhasil diperbarui"),
        });
    };

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Profile card */}
            <Card className="h-full">
                <CardContent className="space-y-4 p-6">
                    <div className="flex justify-center">
                        <div className="relative">
                            <Avatar className="h-20 w-20">
                                <AvatarFallback className="text-2xl font-semibold">
                                    {user.full_name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Fingerprint className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1 text-center">
                        <div className="text-base font-semibold">
                            {user.full_name}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline">{role}</Badge>
                            <Separator orientation="vertical" className="h-4" />
                            <span>{user.position || "Staff"}</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>{user.personal_email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            <span>{user.personal_phone || "+62 --"}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit profile form */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <LayoutDashboard className="h-4 w-4" /> Informasi Utama
                    </CardTitle>
                    <CardDescription>
                        Kelola detail identitas utama yang digunakan di sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={updateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Nama Lengkap</Label>
                                <Input
                                    value={profileForm.data.full_name}
                                    onChange={(e) =>
                                        profileForm.setData(
                                            "full_name",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email (Login)</Label>
                                <Input
                                    value={profileForm.data.personal_email}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nomor Telepon</Label>
                                <Input
                                    value={profileForm.data.personal_phone}
                                    onChange={(e) =>
                                        profileForm.setData(
                                            "personal_phone",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="+62 8xx..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Divisi / Jabatan</Label>
                                <Input
                                    value={user.position || "-"}
                                    readOnly
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="flex justify-end border-t pt-4">
                            <Button disabled={profileForm.processing}>
                                {profileForm.processing && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Konfirmasi Profil
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
