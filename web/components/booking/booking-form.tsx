"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createBooking } from "@/lib/bookings";
import { Court } from "@/types/court";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7);
const DURATIONS = [1, 2, 3, 4];

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function BookingForm({ court }: { court: Court }) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startHour, setStartHour] = useState<number | null>(null);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalPrice = court.price * duration;

  async function handleSubmit() {
    if (!date || startHour === null) {
      toast.error("Pilih tanggal dan jam terlebih dahulu");
      return;
    }

    const startTime = new Date(date);
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + duration);

    setLoading(true);

    try {
      await createBooking({
        court_id: court.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      });

      toast.success("Booking berhasil dibuat! Menunggu konfirmasi pemilik.");
      router.push("/bookings/my");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ before: new Date() }}
          className="mx-auto"
        />
      </Card>

      <Card className="p-4 flex-1 flex flex-col gap-4">
        <div>
          <p className="font-semibold mb-2">Pilih Jam Mulai</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {HOURS.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => setStartHour(hour)}
                className={`text-sm py-2 rounded-md border transition-colors ${
                  startHour === hour
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-input hover:bg-muted"
                }`}
              >
                {hour}:00
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Durasi</p>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`flex-1 text-sm py-2 rounded-md border transition-colors ${
                  duration === d
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-input hover:bg-muted"
                }`}
              >
                {d} Jam
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <span className="text-muted-foreground">Total Harga</span>
          <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Memproses...
            </>
          ) : (
            "Konfirmasi Booking"
          )}
        </Button>
      </Card>
    </div>
  );
}
