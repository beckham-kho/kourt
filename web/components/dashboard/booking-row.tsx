"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, MapPin, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { formatBookingDate, formatBookingTime } from "@/lib/schedule-helpers";
import BookingStatusBadge from "@/components/dashboard/booking-status-badge";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function BookingRow({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<
    "confirmed" | "rejected" | null
  >(null);

  async function handleAction(status: "confirmed" | "rejected") {
    setLoadingAction(status);

    try {
      const res = await fetch(`/api/bookings/${booking.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Gagal memperbarui booking");
        return;
      }

      toast.success(
        status === "confirmed" ? "Booking dikonfirmasi" : "Booking ditolak",
      );
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{booking.customer_name}</span>
          </div>
          <p className="font-semibold flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            {booking.court_name}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {formatBookingDate(booking.start_time)},{" "}
            {formatBookingTime(booking.start_time, booking.end_time)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <BookingStatusBadge status={booking.status} />
          <p className="font-semibold mt-2">
            {formatPrice(booking.total_price)}
          </p>
        </div>
      </div>

      {booking.status === "pending" && (
        <div className="flex gap-2 pt-1 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={loadingAction !== null}
            onClick={() => handleAction("rejected")}
          >
            <X className="h-4 w-4 mr-1" />
            {loadingAction === "rejected" ? "Memproses..." : "Tolak"}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={loadingAction !== null}
            onClick={() => handleAction("confirmed")}
          >
            <Check className="h-4 w-4 mr-1" />
            {loadingAction === "confirmed" ? "Memproses..." : "Terima"}
          </Button>
        </div>
      )}
    </Card>
  );
}
