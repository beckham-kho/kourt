import { Booking } from "@/types/booking";
import { Calendar, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BookingStatusBadge from "./booking-badge";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="border rounded-xl p-4 md:p-5 flex flex-col gap-3 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg">{booking.court_name}</h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(booking.start_time)}
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Total Pembayaran</p>
        <p className="font-bold text-lg">{formatPrice(booking.total_price)}</p>
      </div>
    </div>
  );
}
