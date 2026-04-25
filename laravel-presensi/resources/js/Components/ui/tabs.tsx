import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* ---------------------------------- ROOT --------------------------------- */

function Tabs({
    className,
    orientation = "horizontal",
    ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn(
                "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
                className,
            )}
            {...props}
        />
    );
}

/* -------------------------------- VARIANTS -------------------------------- */

const tabsListVariants = cva(
    "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground data-[orientation=horizontal]:h-9 data-[orientation=vertical]:h-fit data-[orientation=vertical]:flex-col",
    {
        variants: {
            variant: {
                default: "bg-muted",
                line: "gap-1 bg-transparent rounded-none",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

/* ---------------------------------- LIST ---------------------------------- */

function TabsList({
    className,
    variant = "default",
    ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    );
}

/* -------------------------------- TRIGGER --------------------------------- */

function TabsTrigger({
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                "relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-all",
                "hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                "[&_svg]:pointer-events-none [&_svg]:size-4",
                className,
            )}
            {...props}
        />
    );
}

/* -------------------------------- CONTENT --------------------------------- */

function TabsContent({
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn(
                "flex-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className,
            )}
            {...props}
        />
    );
}

/* -------------------------------- EXPORT ---------------------------------- */

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
