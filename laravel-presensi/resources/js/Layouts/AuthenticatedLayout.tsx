import { Head } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import { AppSidebar } from '@/Components/AppSidebar';
import { SiteHeader } from '@/Components/SiteHeader';
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar';

import { TooltipProvider } from '@/Components/ui/tooltip';
import ToastNotifier from '@/Components/ToastNotifier';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    return (
        <TooltipProvider>
            <ToastNotifier />
            <div className="min-h-screen bg-white text-slate-900">
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 72)",
                            "--header-height": "calc(var(--spacing) * 12)",
                        } as React.CSSProperties
                    }
                >
                    <AppSidebar variant="sidebar" />

                    <SidebarInset className="bg-white">
                        <SiteHeader />

                        <div className="flex flex-1 flex-col relative overflow-hidden bg-white">

                        
                        {header && (
                            <header className="px-4 py-4 md:px-6 relative z-10">
                               <div className="mx-auto max-w-7xl">
                                   {header}
                               </div>
                            </header>
                        )}
                        <main className="flex-1 relative z-10">
                            <div className="@container/main flex flex-1 flex-col gap-2 p-4 md:p-6">
                                {children}
                            </div>
                        </main>
                    </div>
                </SidebarInset>
            </SidebarProvider>
            </div>
        </TooltipProvider>
    );
}
