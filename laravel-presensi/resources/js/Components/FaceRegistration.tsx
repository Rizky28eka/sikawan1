import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import {
    Loader2,
    Video,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Circle,
    Server,
    Wifi,
    WifiOff,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Progress } from "@/Components/ui/progress";
import axios from "axios";

interface Props {
    onCapture: (imageBase64: string) => void;
}

export default function FaceRegistration({ onCapture }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const sessionIdRef = useRef<string>("");

    const [loading, setLoading] = useState(true);
    const [ready, setReady] = useState(false);
    const [recording, setRecording] = useState(false);
    const [captured, setCaptured] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const metricsRef = useRef({
        frames_collected: 0,
        frames_valid: 0,
        total_confidence: 0,
        feedbacks: [] as string[]
    });
    const [feedbackMsg, setFeedbackMsg] = useState("Menunggu...");
    const [aiServiceStatus, setAiServiceStatus] = useState<"checking" | "online" | "offline">("checking");
    const [aiServiceUrl, setAiServiceUrl] = useState<string | null>(null);

    const RECORDING_DURATION = 5000; // 5 seconds

    /**
     * Check AI Service Health
     */
    const checkAiService = useCallback(async () => {
        try {
            setAiServiceStatus("checking");
            const response = await axios.get("/api/ai-health");
            if (response.data.status === "ok") {
                setAiServiceStatus("online");
                setAiServiceUrl(response.data.service_url);
            } else {
                setAiServiceStatus("offline");
            }
        } catch (err) {
            console.error("AI Service check failed:", err);
            setAiServiceStatus("offline");
        }
    }, []);

    /**
     * Stop camera safely
     */
    const stopVideo = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setReady(false);
    }, []);

    /**
     * Start camera
     */
    const startVideo = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            stopVideo();

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user",
                },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                videoRef.current.onloadedmetadata = () => {
                    setReady(true);
                    setLoading(false);
                };
            }
        } catch (err) {
            console.error(err);
            setError("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
            setLoading(false);
        }
    }, [stopVideo]);

    /**
     * Start Recording
     */
    const [techInfo, setTechInfo] = useState<{ face_found: boolean; message: string } | null>(null);

    /**
     * Start Frame Feedback Loop
     */
    const startFeedback = useCallback(() => {
        if (!streamRef.current || !videoRef.current || !canvasRef.current || !aiServiceUrl) return;

        sessionIdRef.current = crypto.randomUUID();
        setRecording(true);
        setFeedbackMsg("Mencari wajah...");

        intervalRef.current = setInterval(async () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || captured) return;

            if (video.videoWidth === 0 || video.videoHeight === 0) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);

            try {
                // Get dynamic feedback (stateless)
                const response = await axios.post(`/api/ai/register-frame`, {
                    session_id: sessionIdRef.current,
                    image_base64: imageBase64
                });

                const data = response.data;
                setTechInfo(data);
                setFeedbackMsg(data.message || (data.face_found ? "Wajah terdeteksi" : "Wajah tidak ditemukan"));
                
                if (data.face_found) {
                    setProgress(100);
                } else {
                    setProgress(0);
                }
            } catch (err: any) {
                console.error("Gagal sinkronisasi frame:", err);
            }
        }, 600); // Poll faster for better UI feedback
    }, [aiServiceUrl, captured]);

    /**
     * Capture Final Snapshot
     */
    const captureSnapshot = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const finalImage = canvas.toDataURL("image/jpeg", 0.9);

        setCaptured(true);
        setRecording(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        onCapture(finalImage); // Send raw base64 to parent
        stopVideo();
    }, [onCapture, stopVideo]);

    /**
     * Reset camera
     */
    const resetCamera = useCallback(() => {
        setCaptured(false);
        setProgress(0);
        setError(null);
        startVideo();
    }, [startVideo]);

    useEffect(() => {
        checkAiService();
        startVideo();
        return () => stopVideo();
    }, [startVideo, stopVideo, checkAiService]);

    return (
        <div className="space-y-4">
            {aiServiceStatus === "offline" && (
                <Alert variant="destructive">
                    <WifiOff className="h-4 w-4" />
                    <AlertTitle>AI Service Offline</AlertTitle>
                    <AlertDescription>
                        Mohon hubungi admin. Sistem pendaftaran wajah tidak dapat berjalan.
                    </AlertDescription>
                </Alert>
            )}

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border-2 border-primary/10 shadow-inner">
                {loading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    </div>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Feedback Overlay */}
                {recording && techInfo?.face_found && (
                    <div className="absolute inset-0 z-10 p-6 pointer-events-none ring-4 ring-emerald-500/50 animate-pulse" />
                )}

                {/* Recording UI */}
                {recording && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-6 pointer-events-none">
                        <div className="w-full max-w-sm bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <p className="text-center text-white text-sm font-bold mb-2">
                                {feedbackMsg}
                            </p>
                            <Progress value={progress} className="h-1.5" />
                        </div>
                    </div>
                )}

                {/* Success Overlay */}
                {captured && (
                    <div className="absolute inset-0 z-30 bg-emerald-500/20 backdrop-blur-[2px] flex flex-col items-center justify-center">
                        <div className="size-16 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                        <p className="mt-4 text-white font-bold text-lg">Foto Berhasil Diambil</p>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                {!captured ? (
                    !recording ? (
                        <Button
                            type="button"
                            onClick={startFeedback}
                            disabled={!ready || !aiServiceUrl}
                            className="w-full h-12"
                        >
                            <Video className="mr-2 h-4 w-4" />
                            Mulai Deteksi Kamera
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={captureSnapshot}
                            disabled={!techInfo?.face_found}
                            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Ambil Foto Wajah
                        </Button>
                    )
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={resetCamera}
                        className="w-full h-12"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Ulangi Foto
                    </Button>
                )}
            </div>
            
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold opacity-70">
                Gunakan pencahayaan yang cukup untuk hasil terbaik
            </p>
        </div>
    );
}
