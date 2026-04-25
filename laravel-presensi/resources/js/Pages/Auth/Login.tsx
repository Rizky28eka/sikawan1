import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Separator } from "@/Components/ui/separator";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        personal_email: "",
        password: "",
        remember: false,
    });

    const [obscurePassword, setObscurePassword] = useState(true);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Attempting login with email:", data.personal_email);

        post(route("login"), {
            onFinish: () => {
                console.log("Login request finished.");
                reset("password");
            },
            onSuccess: (page) => {
                console.log("Login success:", page);
            },
            onError: (errors) => {
                console.error("Login errors:", errors);
                toast.error("Login gagal. Periksa kembali email dan kata sandi Anda.");
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <Card className="w-full shadow-sm border-border/60">
                <CardHeader className="pb-6 pt-8 px-8 space-y-4">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="h-11 w-11 bg-primary rounded-xl flex items-center justify-center">
                            <Lock className="text-primary-foreground h-5 w-5" />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="space-y-1.5 text-center">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            Masuk ke Sistem
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gunakan email personal yang terdaftar di perusahaan
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <p className="text-sm text-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
                            {status}
                        </p>
                    )}
                </CardHeader>

                <Separator className="mb-6" />

                <CardContent className="px-8 pb-8">
                    <form onSubmit={submit} className="space-y-5">

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="personal_email"
                                className="text-sm font-medium text-foreground"
                            >
                                Email Personal
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="personal_email"
                                    type="email"
                                    name="personal_email"
                                    value={data.personal_email}
                                    className="pl-9 h-10 bg-muted/40 border-border/60 focus:bg-background transition-colors"
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) =>
                                        setData("personal_email", e.target.value)
                                    }
                                    placeholder="nama@email.com"
                                    required
                                />
                            </div>
                            <InputError message={errors.personal_email} />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Password
                                </Label>
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                                    >
                                        Lupa sandi?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="password"
                                    type={obscurePassword ? "password" : "text"}
                                    name="password"
                                    value={data.password}
                                    className="pl-9 pr-10 h-10 bg-muted/40 border-border/60 focus:bg-background transition-colors"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setObscurePassword(!obscurePassword)}
                                    className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={obscurePassword ? "Tampilkan password" : "Sembunyikan password"}
                                >
                                    {obscurePassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2.5 pt-1">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) =>
                                    setData("remember", checked as boolean)
                                }
                            />
                            <Label
                                htmlFor="remember"
                                className="text-sm text-muted-foreground font-normal cursor-pointer hover:text-foreground transition-colors"
                            >
                                Ingat saya
                            </Label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-10 font-medium mt-2"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Memproses...
                                </>
                            ) : (
                                "Masuk Sekarang"
                            )}
                        </Button>

                        {/* Register Link */}
                        <p className="text-center text-sm text-muted-foreground pt-1">
                            Belum punya akun?{" "}
                            <Link
                                href={route("register")}
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Daftar di sini
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}