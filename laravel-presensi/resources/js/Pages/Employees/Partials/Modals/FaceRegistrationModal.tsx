import { useState, useEffect } from "react";
import { Copy, Info, Loader2, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import { User } from "../types";

interface FaceRegistrationModalProps {
    isOpen: boolean;
    onClose: (val: boolean) => void;
    user: User | null;
}

export default function FaceRegistrationModal({
    isOpen,
    onClose,
    user,
}: FaceRegistrationModalProps) {
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [faceInviteLink, setFaceInviteLink] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setFaceInviteLink(null);
        }
    }, [isOpen]);

    const submitFaceInvite = async () => {
        if (!user) return;
        setIsGeneratingLink(true);
        try {
            const response = await fetch(
                route("employees.generate-face-invite"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || "",
                    },
                    body: JSON.stringify({ user_id: user.id }),
                },
            );
            const res = await response.json();
            if (response.ok && res.link) {
                setFaceInviteLink(res.link);
                toast.success("Link pendaftaran wajah berhasil dibuat!");
            } else {
                console.error("Server error response:", res);
                toast.error(res.message || "Gagal membuat link pendaftaran.");
            }
        } catch (error) {
            console.error("Error generating face registration link:", error);
            toast.error("Gagal membuat link pendaftaran.");
        } finally {
            setIsGeneratingLink(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {user.face_biometric?.requires_re_registration
                            ? "Daftar Ulang Wajah"
                            : "Registrasi Wajah Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        {user.face_biometric?.requires_re_registration
                            ? "Buat link untuk memperbarui data biometrik karyawan."
                            : "Buat link registrasi biometrik untuk karyawan baru."}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-1 text-sm">
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-xs text-muted-foreground">
                            {user.personal_email}
                        </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-md border bg-muted p-3 text-xs text-muted-foreground">
                        <Info className="mt-0.5 h-4 w-4" />
                        <p>
                            Link ini dapat dikirim ke karyawan untuk melakukan
                            pendaftaran wajah secara mandiri dari perangkat mereka.
                        </p>
                    </div>

                    {faceInviteLink ? (
                        <div className="space-y-2">
                            <Label>Link Registrasi</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    readOnly
                                    value={faceInviteLink}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            faceInviteLink,
                                        );
                                        toast.success("Link disalin");
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            className="w-full"
                            onClick={submitFaceInvite}
                            disabled={isGeneratingLink}
                        >
                            {isGeneratingLink ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="mr-2 h-4 w-4" />
                            )}
                            Buat Link Registrasi
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => onClose(false)}
                    >
                        Tutup
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
