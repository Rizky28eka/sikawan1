import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Circle,
    Wifi,
    WifiOff,
    Fingerprint,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Progress } from "@/Components/ui/progress";
import axios from "axios";

interface Props {
    userId: string;
    onCapture: (image: string, metrics: any) => void;
}

export default function FaceVerification({ userId, onCapture }: Props) {
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
    
    const [feedbackMsg, setFeedbackMsg] = useState("Menunggu...");
    const [techInfo, setTechInfo] = useState<{ face_found: boolean; message: string } | null>(null);
    const [aiServiceStatus, setAiServiceStatus] = useState<"checking" | "online" | "offline">("checking");
    const [aiServiceUrl, setAiServiceUrl] = useState<string | null>(null);

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
     * Start camera with robust fallback constraints
     */
    const startVideo = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setReady(false);

            stopVideo();

            let stream: MediaStream | null = null;
            
            // Tiered constraints: Ideal -> Basic -> Any
            const attempts = [
                { video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } },
                { video: { facingMode: "user" } },
                { video: true }
            ];

            for (const constraints of attempts) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                    if (stream) break;
                } catch (e) {
                    console.warn("Camera attempt failed, trying next tier...", constraints, e);
                }
            }

            if (!stream) throw new Error("No camera stream available");

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                
                // Critical: Explicitly call play
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.error("Auto-play prevented:", e));
                }

                // Force ready if track is active
                const track = stream.getVideoTracks()[0];
                if (track && track.readyState === 'live') {
                    // Give it a tiny bit of time for the hardware to warm up
                    setTimeout(() => {
                        setReady(true);
                        setLoading(false);
                    }, 500);
                }

                videoRef.current.onloadedmetadata = () => {
                    setReady(true);
                    setLoading(false);
                };
            }
        } catch (err) {
            console.error("Total camera failure:", err);
            setError("Kamera tidak dapat diakses. Mohon cek izin browser Anda.");
            setLoading(false);
        }
    }, [stopVideo]);

    /**
     * Start Detection Feedback Loop
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
            const imageBase64 = canvas.toDataURL("image/jpeg", 0.6); // Lower quality for feedback loop

            try {
                const response = await axios.post(`/api/ai/verify-frame`, {
                    session_id: sessionIdRef.current,
                    user_id: userId,
                    image_base64: imageBase64
                });

                const data = response.data;
                setTechInfo(data);
                setFeedbackMsg(data.message);
                
                if (data.face_found && data.is_valid) {
                    setProgress(100);
                } else if (data.face_found) {
                    setProgress(50);
                } else {
                    setProgress(0);
                }
            } catch (err: any) {
                console.error("Gagal sinkronisasi frame:", err);
            }
        }, 800);
    }, [aiServiceUrl, userId, captured]);

    /**
     * Capture and Verify
     */
    const captureAndVerify = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const finalImage = canvas.toDataURL("image/jpeg", 0.8);

        setCaptured(true);
        setRecording(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        onCapture(finalImage, { testing_condition: "Verified_Snapshot" });
        stopVideo();
    }, [onCapture, stopVideo]);

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
                <Alert variant="destructive" className="border-rose-200 bg-rose-50">
                    <WifiOff className="h-4 w-4 text-rose-600" />
                    <AlertTitle>Verifikasi Offline</AlertTitle>
                    <AlertDescription>AI Service tidak merespon di port 8088.</AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive" className="border-rose-200 bg-rose-50">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <AlertTitle>Sensor Bermasalah</AlertTitle>
                    <AlertDescription>
                        {error}
                        {!navigator.mediaDevices && (
                            <div className="mt-2 text-xs font-semibold p-2 bg-white/50 rounded">
                                TIP: Browser memblokir kamera karena Website tidak dianggap "Aman". 
                                Mohon akses via <u>localhost:8000</u> (bukan 127.0.0.1).
                            </div>
                        )}
                    </AlertDescription>
                </Alert>
            )}

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border-2 border-primary/10 shadow-2xl">
                {loading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    </div>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover scale-x-[-1] ${ready ? 'opacity-100' : 'opacity-30'}`}
                />

                {recording && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-6 pointer-events-none">
                        <div className="w-full max-w-sm space-y-3 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <p className="text-center text-white text-md font-bold drop-shadow-lg">
                                {feedbackMsg}
                            </p>
                            <Progress value={progress} className="h-2" />
                        </div>
                    </div>
                )}

                {captured && (
                    <div className="absolute inset-0 z-30 bg-emerald-500/20 backdrop-blur-xs flex flex-col items-center justify-center">
                        <div className="size-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                            <CheckCircle2 className="h-12 w-12 text-white" />
                        </div>
                        <p className="mt-6 text-white font-bold text-xl">Wajah Siap Diverifikasi</p>
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
                            className="w-full h-14 text-md font-bold shadow-lg"
                        >
                            <Fingerprint className="mr-3 h-6 w-6" />
                            Mulai Deteksi Wajah
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={captureAndVerify}
                            disabled={!techInfo?.face_found}
                            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-md font-bold"
                        >
                            <CheckCircle2 className="mr-3 h-6 w-6" />
                            Ambil Presensi
                        </Button>
                    )
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={resetCamera}
                        className="w-full h-14 border-2"
                    >
                        <RefreshCw className="mr-3 h-5 w-5" />
                        Ulangi Pemindaian
                    </Button>
                )}
            </div>
        </div>
    );
}
