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
import {
    ShieldCheck,
    Lock,
    AlertTriangle,
    Trash2,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface SecuritySectionProps {
    user: any;
}

export default function SecuritySection({ user }: SecuritySectionProps) {
    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post(route("account-settings.password.update"), {
            onSuccess: () => {
                passwordForm.reset();
                toast.success("Password baru berhasil diaktifkan");
            },
        });
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />{" "}
                        Kredensial Keamanan
                    </CardTitle>
                    <CardDescription>
                        Ganti kata sandi secara berkala untuk menjaga keamanan
                        akun.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form
                        onSubmit={updatePassword}
                        className="max-w-3xl space-y-6"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Password Lama</Label>
                                <Input
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            "current_password",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Password Baru</Label>
                                <Input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            "password",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Konfirmasi Password</Label>
                                <Input
                                    type="password"
                                    value={
                                        passwordForm.data.password_confirmation
                                    }
                                    onChange={(e) =>
                                        passwordForm.setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex justify-end border-t pt-4">
                            <Button
                                disabled={passwordForm.processing}
                                variant="secondary"
                            >
                                {passwordForm.processing && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                <Lock className="mr-2 h-4 w-4" />
                                Update Password
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-rose-50/40">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="font-semibold text-rose-700">
                                Karantina & Penghapusan Akun
                            </div>
                            <p className="text-xs text-rose-700/80">
                                Aksi ini bersifat permanen. Riwayat presensi dan
                                data profil Anda akan diarsipkan.
                            </p>
                        </div>
                    </div>
                    <Button variant="destructive" className="text-xs">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Terminasi Akun
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
