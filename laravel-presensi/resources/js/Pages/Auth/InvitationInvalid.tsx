import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function InvitationInvalid({ message }: { message: string }) {
    return (
        <GuestLayout>
            <Head title="Undangan Tidak Valid" />

            <Card className="w-full max-w-md mx-auto border-none shadow-2xl bg-white/80 backdrop-blur-md">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                        <XCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Ups! Undangan Tidak Valid</CardTitle>
                    <CardDescription className="text-center text-red-600 font-medium">
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-sm text-muted-foreground">
                        Silakan hubungi administrator atau HR perusahaan Anda untuk mendapatkan link undangan baru.
                    </p>
                    <div className="flex justify-center pt-2">
                        <Button variant="outline" asChild>
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Beranda
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
