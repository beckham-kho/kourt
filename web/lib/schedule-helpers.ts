import { Booking } from "@/types/booking";

const DAY_LABELS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export function groupBookingsByWeek(bookings: Booking[], weekStart: Date) {
  const days = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);

    const dayBookings = bookings
      .filter((b) => {
        const bookingDate = new Date(b.start_time);
        return (
          bookingDate.getDate() === currentDate.getDate() &&
          bookingDate.getMonth() === currentDate.getMonth() &&
          bookingDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .map((b) => ({
        startHour: new Date(b.start_time).getHours(),
        endHour: new Date(b.end_time).getHours(),
        courtName: b.court_name,
        customerName: b.customer_name,
      }));

    const today = new Date();
    const isToday =
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();

    days.push({
      label: DAY_LABELS[currentDate.getDay()],
      date: currentDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
      isToday,
      bookings: dayBookings,
    });
  }

  return days;
}

export function formatBookingTime(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return `${formatTime(start)} - ${formatTime(end)}`;
}

export function formatBookingDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
