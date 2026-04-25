import { Copy } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card } from "@/Components/ui/card";
import { toast } from "sonner";
import { Invitation } from "./types";
import { getInvitationBadge } from "./EmployeeBadge";

interface InvitationTableProps {
    invitations: Invitation[];
}

export default function InvitationTable({ invitations }: InvitationTableProps) {
    const copyInviteLink = (token: string) => {
        const url = `${window.location.origin}/invitation/accept/${token}`;
        navigator.clipboard.writeText(url);
        toast.success("Link undangan disalin");
    };

    return (
        <Card>
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden sm:table-cell">
                                Kategori
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden sm:table-cell">
                                Expired
                            </TableHead>
                            <TableHead className="text-right">Opsi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invitations.length > 0 ? (
                            invitations.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">
                                                {inv.email}
                                            </div>
                                            <div className="text-xs text-muted-foreground sm:hidden">
                                                {inv.position || "-"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="space-y-1 text-xs">
                                            <div>{inv.role}</div>
                                            <div className="text-muted-foreground">
                                                {inv.position || "-"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getInvitationBadge(
                                            inv.effective_status,
                                        )}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(
                                                inv.expires_at,
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                inv.effective_status !==
                                                "pending"
                                            }
                                            onClick={() =>
                                                copyInviteLink(inv.token)
                                            }
                                        >
                                            <Copy className="mr-2 h-4 w-4" />
                                            Salin Link
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-40 text-center text-sm text-muted-foreground"
                                >
                                    Belum ada undangan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
