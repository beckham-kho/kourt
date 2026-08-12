"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DayBooking {
  startHour: number;
  endHour: number;
  courtName: string;
  customerName: string;
}

interface WeeklyScheduleProps {
  days: {
    label: string;
    date: string;
    isToday?: boolean;
    bookings: DayBooking[];
  }[];
}

const START_HOUR = 7;
const END_HOUR = 24;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const ROW_HEIGHT = 48;

function useCurrentTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return now;
}

export default function WeeklySchedule({ days }: WeeklyScheduleProps) {
  const now = useCurrentTime();

  const currentHourDecimal = now
    ? now.getHours() + now.getMinutes() / 60
    : null;

  const isWithinScheduleRange =
    currentHourDecimal !== null &&
    currentHourDecimal >= START_HOUR &&
    currentHourDecimal <= END_HOUR;

  const nowTopPercent = isWithinScheduleRange
    ? ((currentHourDecimal! - START_HOUR) / TOTAL_HOURS) * 100
    : null;

  const currentTimeLabel = now
    ? now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="border rounded-lg overflow-x-auto">
      <div className="min-w-200 flex">
        <div className="w-14 shrink-0">
          <div className="h-12 border-b" />
          {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
            <div
              key={i}
              style={{ height: ROW_HEIGHT }}
              className="text-xs text-muted-foreground text-right pr-2 pt-1 border-b"
            >
              {START_HOUR + i}:00
            </div>
          ))}
        </div>

        {days.map((day) => (
          <div key={day.label} className="flex-1 border-l">
            <div
              className={cn(
                "h-12 border-b flex flex-col items-center justify-center",
                day.isToday && "bg-primary/10",
              )}
            >
              <span
                className={cn(
                  "text-sm font-semibold",
                  day.isToday && "text-primary",
                )}
              >
                {day.label}
              </span>
              <span className="text-xs text-muted-foreground">{day.date}</span>
            </div>

            <div
              className="relative"
              style={{ height: ROW_HEIGHT * TOTAL_HOURS }}
            >
              {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                <div
                  key={i}
                  style={{ height: ROW_HEIGHT }}
                  className="border-b"
                />
              ))}

              {day.bookings.map((booking, i) => {
                const top =
                  ((booking.startHour - START_HOUR) / TOTAL_HOURS) * 100;
                const height =
                  ((booking.endHour - booking.startHour) / TOTAL_HOURS) * 100;

                return (
                  <div
                    key={i}
                    className="absolute left-1 right-1 bg-primary text-primary-foreground rounded-md p-1.5 overflow-hidden"
                    style={{ top: `${top}%`, height: `${height}%` }}
                  >
                    <p className="text-xs font-medium truncate">
                      {booking.courtName}
                    </p>
                    <p className="text-xs opacity-90 truncate">
                      {booking.customerName}
                    </p>
                  </div>
                );
              })}

              {day.isToday && nowTopPercent !== null && (
                <div
                  className="absolute left-0 right-0 z-10 pointer-events-none"
                  style={{ top: `${nowTopPercent}%` }}
                >
                  <div className="relative flex items-center">
                    <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-red-500 ring-2 ring-white" />
                    <div className="w-full h-px bg-red-500" />
                    <span className="absolute -top-1.5 left-2.5 text-[10px] font-medium text-red-500 bg-white px-1 rounded">
                      {currentTimeLabel}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
