import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { GraduationCap } from 'lucide-react';

import ToastNotifier from '@/Components/ToastNotifier';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950 p-6 md:p-10">
            <ToastNotifier />
            {/* Logo and Form centered */}
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                <div className="flex justify-center">
                    <Link href="/" className="flex items-center gap-2 font-display font-bold text-2xl group">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <GraduationCap className="size-6" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 font-black tracking-tight">
                            SIKAWAN
                        </span>
                    </Link>
                </div>
                
                {/* Form Container */}
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
