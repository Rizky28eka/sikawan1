import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { PageProps } from '@/types';
import { 
    CheckCircle2, 
    AlertCircle, 
    AlertTriangle, 
    Info, 
    XCircle 
} from 'lucide-react';

export default function ToastNotifier() {
    const { flash, errors } = usePage<PageProps>().props;

    useEffect(() => {
        // Handle explicit success messages
        if (flash.success) {
            toast.success('Berhasil!', {
                description: flash.success,
                icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
                className: 'group-[.toaster]:bg-emerald-50 group-[.toaster]:border-emerald-200 group-[.toaster]:text-emerald-900 dark:group-[.toaster]:bg-emerald-950 dark:group-[.toaster]:border-emerald-900 dark:group-[.toaster]:text-emerald-50',
            });
        }

        // Handle explicit error messages
        if (flash.error) {
            toast.error('Terjadi Kesalahan', {
                description: flash.error,
                icon: <XCircle className="h-5 w-5 text-rose-500" />,
                className: 'group-[.toaster]:bg-rose-50 group-[.toaster]:border-rose-200 group-[.toaster]:text-rose-900 dark:group-[.toaster]:bg-rose-950 dark:group-[.toaster]:border-rose-900 dark:group-[.toaster]:text-rose-50',
            });
        }

        // Handle warning messages
        if (flash.warning) {
            toast.warning('Peringatan', {
                description: flash.warning,
                icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
                className: 'group-[.toaster]:bg-amber-50 group-[.toaster]:border-amber-200 group-[.toaster]:text-amber-900 dark:group-[.toaster]:bg-amber-950 dark:group-[.toaster]:border-amber-900 dark:group-[.toaster]:text-amber-50',
            });
        }

        // Handle general info/message/status
        const infoMsg = flash.info || flash.message || flash.status;
        if (infoMsg) {
            toast.info('Informasi', {
                description: infoMsg,
                icon: <Info className="h-5 w-5 text-blue-500" />,
                className: 'group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-200 group-[.toaster]:text-blue-900 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:border-blue-900 dark:group-[.toaster]:text-blue-50',
            });
        }

        // Handle validation errors if any
        if (errors && Object.keys(errors).length > 0) {
            const errorCount = Object.keys(errors).length;
            if (errorCount === 1) {
                const firstError = Object.values(errors)[0];
                toast.error('Kesalahan Validasi', {
                    description: firstError as string,
                    icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
                    className: 'group-[.toaster]:bg-rose-50 group-[.toaster]:border-rose-200 group-[.toaster]:text-rose-900 dark:group-[.toaster]:bg-rose-950 dark:group-[.toaster]:border-rose-900 dark:group-[.toaster]:text-rose-50',
                });
            } else {
                toast.error('Kesalahan Validasi', {
                    description: `Terdapat ${errorCount} kesalahan pada form Anda.`,
                    icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
                    className: 'group-[.toaster]:bg-rose-50 group-[.toaster]:border-rose-200 group-[.toaster]:text-rose-900 dark:group-[.toaster]:bg-rose-950 dark:group-[.toaster]:border-rose-900 dark:group-[.toaster]:text-rose-50',
                });
            }
        }
    }, [flash, errors]);

    return null;
}
