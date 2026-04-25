import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";

interface Props {
    currentPage: number;
    lastPage: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function Pagination({ currentPage, lastPage, links }: Props) {
    return (
        <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/5 flex flex-col xs:flex-row items-center justify-between gap-3">
            <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Halaman <span className="text-foreground">{currentPage}</span> dari {lastPage}
            </p>
            <div className="flex items-center gap-1.5">
                {links.map((link, i) => (
                    <Button
                        key={i}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        disabled={!link.url}
                        className={cn(
                            "h-7 min-w-7 px-2 text-[10px] font-medium",
                            !link.url && "opacity-50"
                        )}
                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
