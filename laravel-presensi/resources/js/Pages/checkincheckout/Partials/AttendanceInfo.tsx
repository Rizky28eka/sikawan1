import { Card, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Clock, MapPin } from "lucide-react";

interface AttendanceInfoProps {
    shift: any;
    site: any;
}

export default function AttendanceInfo({ shift, site }: AttendanceInfoProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 space-y-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Informasi Shift
                </CardTitle>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nama Shift</span>
                        <span className="font-medium">{shift?.name || "-"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Jam Kerja</span>
                        <span className="font-medium">
                            {shift?.start_time} - {shift?.end_time}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Toleransi</span>
                        <span className="font-medium">
                            {shift?.late_tolerance} Menit
                        </span>
                    </div>
                </div>
            </Card>

            <Card className="p-6 space-y-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Detail Lokasi
                </CardTitle>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Site</span>
                        <span className="font-medium">{site?.name || "-"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Geo-fencing</span>
                        <Badge variant="outline" className="text-[10px]">
                            Aktif
                        </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Alamat</span>
                        <span className="font-medium truncate max-w-[150px]">
                            {site?.address || "-"}
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
