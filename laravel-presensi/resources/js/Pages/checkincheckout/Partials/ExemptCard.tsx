import { Card, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Fingerprint } from "lucide-react";

interface ExemptCardProps {
    userRole: string;
}

export default function ExemptCard({ userRole }: ExemptCardProps) {
    return (
        <Card className="border-dashed border-2 bg-muted/50 flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Fingerprint className="h-10 w-10 text-primary" />
            </div>
            <div className="max-w-md space-y-2">
                <CardTitle className="text-2xl">Akun Bebas Absensi</CardTitle>
                <CardDescription>
                    Akun Anda ({userRole}) tidak diwajibkan melakukan presensi harian.
                    Akses sistem tetap dapat digunakan sepenuhnya.
                </CardDescription>
            </div>
            <Button variant="outline" asChild>
                <a href={route("dashboard")}>Ke Dashboard</a>
            </Button>
        </Card>
    );
}
