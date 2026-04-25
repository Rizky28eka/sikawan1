import { Separator } from "@/Components/ui/separator";
import { SidebarTrigger } from "@/Components/ui/sidebar";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 flex h-20 shrink-0 items-center border-b border-slate-100 bg-white/80 backdrop-blur-xl transition-all duration-300">
            <div className="flex w-full items-center gap-6 px-6 lg:px-8">
                <SidebarTrigger className="-ml-2 h-10 w-10 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all duration-300" />

                <div className="h-8 w-px bg-slate-100 rotate-20 opacity-60" />

                <div className="flex flex-col">
                    <h1 className="text-lg font-black bg-linear-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent tracking-tight">
                        Sikawan <span className="text-primary italic">Management</span>
                    </h1>

                </div>

                {/* Right actions can go here */}
                <div className="ml-auto flex items-center gap-4" />
            </div>
        </header>
    );
}
