import { Badge } from "@/Components/ui/badge";
import { Invitation } from "./types";

export const getStatusBadge = (status: string | boolean) => {
    const statusStr =
        typeof status === "boolean"
            ? status
                ? "active"
                : "inactive"
            : status;

    switch (statusStr) {
        case "active":
            return <Badge variant="default">Aktif</Badge>;
        case "inactive":
            return <Badge variant="outline">Nonaktif</Badge>;
        case "resigned":
            return <Badge variant="outline">Resigned</Badge>;
        case "terminated":
            return <Badge variant="destructive">Dipecat</Badge>;
        default:
            return <Badge variant="outline">{String(statusStr)}</Badge>;
    }
};

export const getInvitationBadge = (status: Invitation["effective_status"]) => {
    switch (status) {
        case "accepted":
            return <Badge variant="default">Diterima</Badge>;
        case "pending":
            return <Badge variant="outline">Tertunda</Badge>;
        case "expired":
            return <Badge variant="destructive">Expired</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};
