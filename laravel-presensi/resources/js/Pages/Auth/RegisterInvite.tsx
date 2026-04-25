import React, { useEffect, FormEventHandler, useState, FormEvent } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Lock,
    Mail,
    Calendar,
    Phone,
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    Check,
    Loader2,
} from "lucide-react";
import FaceRegistration from "@/Components/FaceRegistration";

interface Invitation {
    token: string;
    email: string;
    role: string;
    position: string;
    type: string;
}

interface ExistingUser {
    full_name: string;
    personal_email: string;
    personal_phone: string;
    join_date: string;
}

export default function RegisterInvite({
    invitation,
    company_name,
    existing_user,
}: {
    invitation: Invitation;
    company_name: string;
    existing_user?: ExistingUser;
}) {
    const [step, setStep] = useState(existing_user ? 2 : 1);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: invitation.token,
        email: existing_user?.personal_email || invitation.email || "",
        full_name: existing_user?.full_name || "",
        personal_phone: existing_user?.personal_phone || "",
        join_date:
            existing_user?.join_date?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
        password: "",
        password_confirmation: "",
        image_base64: "" as string,
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, [reset]);

    /**
     * STEP 1 VALIDATION
     */
    const nextStep = (e: FormEvent) => {
        e.preventDefault();

        if (
            !data.email ||
            !data.full_name ||
            !data.personal_phone ||
            !data.password ||
            !data.password_confirmation
        ) {
            return;
        }

        if (data.password !== data.password_confirmation) {
            return;
        }

        setStep(2);
    };

    /**
     * FINAL SUBMIT
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.image_base64) {
            return;
        }

        post(route("invitation.register"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    "Registrasi berhasil. Silakan lanjutkan ke login.",
                );
            },
            onError: (errors) => {
                const firstError = Array.isArray(errors)
                    ? errors[0]
                    : Object.values(errors).flat()[0];

                const message =
                    (errors as any)?.message ||
                    (typeof firstError === "string" ? firstError : undefined) ||
                    "Terjadi kesalahan saat registrasi. Pastikan pencahayaan cukup dan wajah terlihat jelas.";

                toast.error(message);
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrasi Karyawan" />

            <div className="w-full max-w-xl mx-auto space-y-6">
                {/* STEP INDICATOR */}

                <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        >
                            {step > 1 ? <Check className="h-4 w-4" /> : "1"}
                        </div>
                        <span
                            className={`text-sm ${step === 1 ? "font-bold text-primary" : "text-muted-foreground"}`}
                        >
                            Data Akun
                        </span>
                    </div>

                    <div className="h-px bg-muted flex-1 mx-4" />

                    <div className="flex items-center gap-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        >
                            2
                        </div>
                        <span
                            className={`text-sm ${step === 2 ? "font-bold text-primary" : "text-muted-foreground"}`}
                        >
                            Biometrik
                        </span>
                    </div>
                </div>

                <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden">
                    <CardHeader className="space-y-1 flex flex-col items-center bg-primary/5 pb-8">
                        <div className="size-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 text-primary rotate-3">
                            <ShieldCheck className="h-8 w-8" />
                        </div>

                        <CardTitle className="text-2xl font-bold text-center">
                            Bergabung dengan {company_name}
                        </CardTitle>

                        <CardDescription className="text-center font-medium max-w-[300px]">
                            {existing_user
                                ? `Halo ${existing_user.full_name}, silakan lakukan registrasi wajah untuk menyelesaikan pengaturan akun Anda.`
                                : "Silakan lengkapi profil Anda untuk mulai menggunakan sistem presensi."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8">
                        {/* STEP 1 */}

                        {step === 1 && (
                            <form onSubmit={nextStep} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Alamat Email</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        disabled={!!invitation.email}
                                        required
                                    />

                                    {errors.email && (
                                        <p className="text-xs text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Nama Lengkap</Label>

                                    <Input
                                        value={data.full_name}
                                        onChange={(e) =>
                                            setData("full_name", e.target.value)
                                        }
                                        required
                                    />

                                    {errors.full_name && (
                                        <p className="text-xs text-red-500">
                                            {errors.full_name}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Nomor Telepon</Label>

                                        <Input
                                            value={data.personal_phone}
                                            onChange={(e) =>
                                                setData(
                                                    "personal_phone",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />

                                        {errors.personal_phone && (
                                            <p className="text-xs text-red-500">
                                                {errors.personal_phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Tanggal Mulai</Label>

                                        <Input
                                            type="date"
                                            value={data.join_date}
                                            onChange={(e) =>
                                                setData(
                                                    "join_date",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Password</Label>

                                        <Input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />

                                        {errors.password && (
                                            <p className="text-xs text-red-500">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Konfirmasi Password</Label>

                                        <Input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 font-bold"
                                >
                                    Lanjut ke Registrasi Wajah
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        )}

                        {/* STEP 2 */}

                        {step === 2 && (
                            <form onSubmit={submit} className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-bold">
                                        Verifikasi Biometrik Wajah
                                    </h3>

                                    <p className="text-sm text-muted-foreground">
                                        Pastikan wajah terlihat jelas dan
                                        pencahayaan cukup.
                                    </p>
                                </div>

                                <FaceRegistration
                                    onCapture={(imageBase64) =>
                                        setData("image_base64", imageBase64)
                                    }
                                />

                                {errors.image_base64 && (
                                    <p className="text-center text-xs text-red-500">
                                        {errors.image_base64}
                                    </p>
                                )}

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        disabled={processing}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Kembali
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={
                                            processing || !data.image_base64
                                        }
                                        className="flex-1 font-bold"
                                    >
                                        {processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}

                                        {processing
                                            ? "Mendaftarkan..."
                                            : "Selesaikan Pendaftaran"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Link
                        href={route("login")}
                        className="text-sm text-muted-foreground hover:text-primary"
                    >
                        ← Kembali ke Login
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
