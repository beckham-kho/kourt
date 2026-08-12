import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock } from "lucide-react";
import { formatBookingDate, formatBookingTime } from "@/lib/schedule-helpers";

interface PendingBookingCardProps {
  id: string;
  customerName: string;
  courtName: string;
  startTime: string;
  endTime: string;
}

export default function PendingBookingCard({
  id,
  customerName,
  courtName,
  startTime,
  endTime,
}: PendingBookingCardProps) {
  return (
    <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="font-semibold">{customerName}</p>
        <p className="text-sm text-muted-foreground">{courtName}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <Clock className="h-3 w-3" />
          {formatBookingDate(startTime)},{" "}
          {formatBookingTime(startTime, endTime)}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
          <X className="h-4 w-4 mr-1" />
          Tolak
        </Button>
        <Button size="sm" className="flex-1 sm:flex-none">
          <Check className="h-4 w-4 mr-1" />
          Terima
        </Button>
      </div>
    </Card>
  );
}
