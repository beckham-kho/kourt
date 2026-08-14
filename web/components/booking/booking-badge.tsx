import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/booking";

const STATUS_CONFIG: Record<
  Booking["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Menunggu",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  confirmed: {
    label: "Dikonfirmasi",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  completed: {
    label: "Selesai",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  rejected: {
    label: "Ditolak",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-muted text-muted-foreground hover:bg-muted",
  },
};

export default function BookingStatusBadge({
  status,
}: {
  status: Booking["status"];
}) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return <Badge className={cn(config.className)}>{config.label}</Badge>;
}
