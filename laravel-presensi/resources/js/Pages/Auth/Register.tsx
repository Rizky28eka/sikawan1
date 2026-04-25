import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import {
    ArrowRight,
    ArrowLeft,
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    IdCard,
    Lock,
    Loader2,
    Eye,
    EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Textarea } from "@/Components/ui/textarea";
import { Separator } from "@/Components/ui/separator";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";

export default function Register() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        company_name: "",
        company_code: "",
        company_email: "",
        company_phone: "",
        company_address: "",
        full_name: "",
        personal_email: "",
        personal_phone: "",
        password: "",
        password_confirmation: "",
        terms: false,
    });

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Fallback: Generate company_code if empty (case for autofill)
        if (!data.company_code && data.company_name) {
            const code = data.company_name
                .split(" ")
                .map(word => word.charAt(0))
                .join("")
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .substring(0, 6);
            
            setData("company_code", code);
            // Wait for next tick to submit with new data
            setTimeout(() => {
                post(route("register"), {
                    onFinish: () => reset("password", "password_confirmation"),
                    onError: () => toast.error("Pendaftaran gagal. Periksa kembali data yang Anda masukkan."),
                });
            }, 0);
            return;
        }

        console.log("Submitting registration data:", data);

        post(route("register"), {
            onFinish: () => {
                console.log("Registration request finished.");
                reset("password", "password_confirmation");
            },
            onSuccess: (page) => {
                console.log("Registration success:", page);
            },
            onError: (errors) => {
                console.error("Registration validation errors:", errors);
                toast.error("Pendaftaran gagal. Periksa kembali data yang Anda masukkan.");
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Pendaftaran Perusahaan" />

            <Card className="w-full shadow-sm border-border/60">
                <CardHeader className="pb-5 pt-8 px-8 space-y-4">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="h-11 w-11 bg-primary rounded-xl flex items-center justify-center">
                            <Building2 className="text-primary-foreground h-5 w-5" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1 text-center">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            Daftarkan Perusahaan
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {step === 1
                                ? "Langkah 1 dari 2 — Profil Bisnis"
                                : "Langkah 2 dari 2 — Profil Administrator"}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-3 pt-1">
                        <div className="flex items-center gap-2">
                            <div
                                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                                    step >= 1
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground border border-border"
                                }`}
                            >
                                {step > 1 ? "✓" : "1"}
                            </div>
                            <span
                                className={`text-xs font-medium transition-colors ${
                                    step === 1
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                }`}
                            >
                                Profil Bisnis
                            </span>
                        </div>

                        <div className="w-10 h-px bg-border" />

                        <div className="flex items-center gap-2">
                            <div
                                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                                    step === 2
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground border border-border"
                                }`}
                            >
                                2
                            </div>
                            <span
                                className={`text-xs font-medium transition-colors ${
                                    step === 2
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                }`}
                            >
                                Administrator
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <Separator />

                <CardContent className="px-8 pb-8 pt-2">
                    <form onSubmit={submit}>
                        {step === 1 ? (
                            <div className="space-y-5">
                                {/* Company Name */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="company_name"
                                        className="text-sm font-medium"
                                    >
                                        Nama Perusahaan
                                    </Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="company_name"
                                            value={data.company_name}
                                            className="pl-9 h-10 bg-muted/40 border-border/60 focus:bg-background transition-colors"
                                            placeholder="PT. Maju Bersama"
                                            autoFocus
                                            onChange={(e) => {
                                                const name = e.target.value;
                                                const code = name
                                                    .split(" ")
                                                    .map(word => word.charAt(0))
                                                    .join("")
                                                    .toUpperCase()
                                                    .replace(/[^A-Z0-9]/g, "")
                                                    .substring(0, 6);
                                                
                                                setData(val => ({
                                                    ...val,
                                                    company_name: name,
                                                    company_code: code
                                                }));
                                            }}
                                        />
                                    </div>
                                    <InputError message={errors.company_name} />
                                </div>

                                {/* Email & Phone Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="company_email"
                                            className="text-sm font-medium"
                                        >
                                            Email Kantor
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                            <Input
                                                id="company_email"
                                                type="email"
                                                value={data.company_email}
                                                className="pl-9 h-10 bg-muted/40 border-border/60 text-sm"
                                                placeholder="hr@maju.com"
                                                onChange={(e) =>
                                                    setData(
                                                        "company_email",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <InputError
                                            message={errors.company_email}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="company_phone"
                                            className="text-sm font-medium"
                                        >
                                            No. Telepon
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                            <Input
                                                id="company_phone"
                                                value={data.company_phone}
                                                className="pl-9 h-10 bg-muted/40 border-border/60 text-sm"
                                                placeholder="021-xxxx"
                                                onChange={(e) =>
                                                    setData(
                                                        "company_phone",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <InputError
                                            message={errors.company_phone}
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="company_address"
                                        className="text-sm font-medium"
                                    >
                                        Alamat Lengkap
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Textarea
                                            id="company_address"
                                            value={data.company_address}
                                            className="pl-9 pt-2.5 min-h-20 bg-muted/40 border-border/60 resize-none"
                                            placeholder="Jl. Sudirman No. 1, Jakarta"
                                            onChange={(e) =>
                                                setData(
                                                    "company_address",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={errors.company_address}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full h-10 font-medium mt-2"
                                >
                                    Lanjutkan
                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="full_name"
                                        className="text-sm font-medium"
                                    >
                                        Nama Lengkap Owner
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="full_name"
                                            value={data.full_name}
                                            className="pl-9 h-10 bg-muted/40 border-border/60"
                                            placeholder="John Doe"
                                            autoFocus
                                            onChange={(e) =>
                                                setData(
                                                    "full_name",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError message={errors.full_name} />
                                </div>

                                {/* Personal Email */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="personal_email"
                                        className="text-sm font-medium"
                                    >
                                        Email Pribadi
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="personal_email"
                                            type="email"
                                            value={data.personal_email}
                                            className="pl-9 h-10 bg-muted/40 border-border/60"
                                            placeholder="john@example.com"
                                            onChange={(e) =>
                                                setData(
                                                    "personal_email",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={errors.personal_email}
                                    />
                                </div>
                                
                                {/* Personal Phone */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="personal_phone"
                                        className="text-sm font-medium"
                                    >
                                        Nomor HP Pribadi
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="personal_phone"
                                            value={data.personal_phone}
                                            className="pl-9 h-10 bg-muted/40 border-border/60"
                                            placeholder="08123456789"
                                            onChange={(e) =>
                                                setData(
                                                    "personal_phone",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={errors.personal_phone}
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium"
                                    >
                                        Password Akun
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={data.password}
                                            className="pl-9 pr-10 h-10 bg-muted/40 border-border/60"
                                            placeholder="••••••••"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                            aria-label={
                                                showPassword
                                                    ? "Sembunyikan password"
                                                    : "Tampilkan password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-sm font-medium"
                                    >
                                        Konfirmasi Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="password_confirmation"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={data.password_confirmation}
                                            className="pl-9 h-10 bg-muted/40 border-border/60"
                                            placeholder="••••••••"
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                {/* Terms */}
                                <div className="flex items-start gap-3 pt-1">
                                    <Checkbox
                                        id="terms"
                                        checked={data.terms}
                                        onCheckedChange={(checked) =>
                                            setData("terms", checked as boolean)
                                        }
                                        className="mt-0.5"
                                    />
                                    <Label
                                        htmlFor="terms"
                                        className="text-sm text-muted-foreground font-normal leading-relaxed cursor-pointer"
                                    >
                                        Saya menyetujui{" "}
                                        <a
                                            href="#"
                                            className="text-primary font-medium hover:underline"
                                        >
                                            Syarat & Ketentuan
                                        </a>{" "}
                                        serta{" "}
                                        <a
                                            href="#"
                                            className="text-primary font-medium hover:underline"
                                        >
                                            Kebijakan Privasi
                                        </a>
                                        .
                                    </Label>
                                </div>
                                <InputError message={errors.terms} />

                                {/* Navigation Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(1)}
                                        className="flex-1 h-10"
                                        disabled={processing}
                                    >
                                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                                        Kembali
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-[1.5] h-10 font-medium"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            "Selesaikan"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>

                    <Separator className="my-6" />

                    <p className="text-center text-sm text-muted-foreground">
                        Sudah terdaftar?{" "}
                        <Link
                            href={route("login")}
                            className="text-primary font-medium hover:text-primary/80 transition-colors"
                        >
                            Masuk Dashboard
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
