import { useForm } from "@inertiajs/react";
import { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    Fingerprint,
    MapPin,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Info,
} from "lucide-react";
import { toast } from "sonner";
import FaceVerification from "@/Components/FaceVerification";

interface AttendanceFormProps {
    user: any;
    site: any;
    todayAttendance: any;
}

export default function AttendanceForm({
    user,
    site,
    todayAttendance,
}: AttendanceFormProps) {
    const [locationStatus, setLocationStatus] = useState<
        "pending" | "success" | "error"
    >("pending");

    const suggestedType = !todayAttendance
        ? "CLOCK_IN"
        : todayAttendance.type === "CLOCK_IN"
          ? "CLOCK_OUT"
          : "FINISHED";

    const { data, setData, post, processing } = useForm({
        type: suggestedType === "FINISHED" ? "CLOCK_OUT" : suggestedType,
        image_base64: "",
        images_base64: [] as string[],
        latitude: 0,
        longitude: 0,
        telemetry_location: {
            source: "Web Browser + GPS",
            accuracy: 0,
            altitude: 0,
            speed: 0,
            heading: 0,
            timestamp_device: new Date().toISOString(),
        },
        telemetry_network: {
            type: navigator.onLine ? "online" : "offline",
            user_agent: navigator.userAgent,
            effective_type:
                (navigator as any).connection?.effectiveType || "unknown",
            downlink: (navigator as any).connection?.downlink || 0,
            rtt: (navigator as any).connection?.rtt || 0,
        },
        telemetry_biometric: {
            frame_count: 0,
        },
        device_fingerprint: crypto.randomUUID(),
    });

    const fetchLocation = useCallback(() => {
        setLocationStatus("pending");
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setData((prev) => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        telemetry_location: {
                            ...prev.telemetry_location,
                            accuracy: position.coords.accuracy,
                            altitude: position.coords.altitude || 0,
                            speed: position.coords.speed || 0,
                            heading: position.coords.heading || 0,
                            timestamp_device: new Date(
                                position.timestamp,
                            ).toISOString(),
                        },
                    }));
                    setLocationStatus("success");
                    toast.success("Lokasi berhasil dikunci.", {
                        description: `Akurasi: ${position.coords.accuracy.toFixed(
                            1,
                        )}m | Alt: ${Math.round(
                            position.coords.altitude || 0,
                        )}m`,
                    });
                },
                (err) => {
                    console.error("Location error:", err);
                    setLocationStatus("error");
                    toast.error(
                        "Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin diberikan.",
                    );
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                },
            );
        }
    }, [setData]);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    const onCaptureComplete = (image: string, metrics: any) => {
        setData((prev) => ({
            ...prev,
            image_base64: image,
            telemetry_biometric: {
                ...prev.telemetry_biometric,
                frame_count: 1,
                ...metrics,
            },
        }));
        toast.success("Verifikasi wajah berhasil diambil.");
    };

    const resetCapture = () => {
        setData("image_base64", "");
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.image_base64) {
            toast.error("Silakan ambil verifikasi wajah terlebih dahulu.");
            return;
        }

        if (locationStatus === "error") {
            toast.error("Lokasi tidak tersedia. Silakan izinkan akses GPS.");
            return;
        }

        if (data.latitude === 0 || data.longitude === 0) {
            toast.error("Menunggu koordinat lokasi...");
            return;
        }

        post(route("attendance.check.store"), {
            preserveScroll: true,
            onSuccess: () => {
                resetCapture();
            },
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
                <Card className="overflow-hidden border-none shadow-xl ring-1 ring-muted">
                    <div className="p-1">
                        <FaceVerification
                            userId={user.id}
                            onCapture={onCaptureComplete}
                        />
                    </div>

                    <CardFooter className="bg-muted/50 p-4 justify-between flex items-center">
                        <div className="flex items-center gap-3">
                            {data.image_base64 && (
                                <div className="size-12 rounded-md border-2 border-primary overflow-hidden shadow-sm">
                                    <img
                                        src={data.image_base64}
                                        className="size-full object-cover mirror"
                                    />
                                </div>
                            )}
                            {data.image_base64 && (
                                <span className="text-xs text-muted-foreground font-medium">
                                    Snapshot Siap Dikirim
                                </span>
                            )}
                        </div>

                        {data.image_base64 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetCapture}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" /> Ulangi
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>

            <div className="lg:col-span-5 space-y-6">
                <Card className="shadow-lg border-muted/50">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Form Konfirmasi
                        </CardTitle>
                        <CardDescription>
                            Pastikan data di bawah sesuai sebelum mengirim.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">
                                    Status
                                </p>
                                <p className="font-semibold text-primary">
                                    {data.type === "CLOCK_IN"
                                        ? "Masuk"
                                        : "Pulang"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">
                                    Lokasi Presensi
                                </p>
                                <p className="font-semibold truncate">
                                    {site?.name || "Wilayah Kerja"}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/30 border border-muted space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Fingerprint className="h-4 w-4" />
                                    <span>Biometrik</span>
                                </div>
                                {data.image_base64 ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>Koordinat GPS</span>
                                </div>
                                {locationStatus === "success" ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : locationStatus === "error" ? (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            fetchLocation();
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                    </Button>
                                ) : (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full h-12 text-lg shadow-xl shadow-primary/20"
                            disabled={
                                !data.image_base64 ||
                                locationStatus !== "success" ||
                                processing
                            }
                            onClick={handleFormSubmit}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Mengirim...
                                </>
                            ) : locationStatus === "error" ? (
                                "Gagal: Butuh GPS"
                            ) : (
                                "Simpan Presensi"
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="pt-6 flex gap-3">
                        <Info className="h-5 w-5 text-primary shrink-0" />
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Informasi Penting
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Pastikan wajah terlihat jelas tanpa penutup.
                                Sistem akan melakukan validasi AI untuk mencegah
                                pemalsuan foto.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style>{`
                .mirror {
                    transform: scaleX(-1);
                }
            `}</style>
        </div>
    );
}
