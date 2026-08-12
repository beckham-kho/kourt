import StatCard from "@/components/dashboard/stat-card";
import PendingBookingCard from "@/components/dashboard/pending-booking-card";
import WeeklySchedule from "@/components/dashboard/weekly-schedule";
import { CalendarCheck, Wallet, Building2, Star } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth-server";
import {
  getOwnerStats,
  getPendingBookings,
  getWeeklySchedule,
} from "@/lib/bookings";
import { groupBookingsByWeek } from "@/lib/schedule-helpers";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function DashboardPage() {
  const token = await getAccessToken();

  if (!token) {
    redirect("/login");
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

  const [stats, pendingBookings, weeklyBookings] = await Promise.all([
    getOwnerStats(token),
    getPendingBookings(token),
    getWeeklySchedule(token, weekStart),
  ]);

  const statCards = [
    {
      title: "Total Booking",
      period: "Minggu",
      value: `${stats?.total_bookings_this_week ?? 0} Booking`,
      description: `${pendingBookings.length} pending konfirmasi`,
      icon: CalendarCheck,
    },
    {
      title: "Pendapatan",
      period: "Bulan",
      value: formatPrice(stats?.revenue_this_month ?? 0),
      description: "Booking selesai bulan ini",
      icon: Wallet,
    },
    {
      title: "Lapangan Aktif",
      period: "Total",
      value: `${stats?.active_courts ?? 0} Lapangan`,
      description: "Semua status aktif",
      icon: Building2,
    },
    {
      title: "Rating Rata-rata",
      period: "Keseluruhan",
      value: `${stats?.average_rating ?? 0} / 5.0`,
      description: "Dari seluruh lapangan",
      icon: Star,
    },
  ];

  const weekData = groupBookingsByWeek(weeklyBookings, weekStart);

  return (
    <>
      <h1 className="text-2xl font-bold mt-4 mb-3">Ringkasan</h1>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Perlu Konfirmasi</h2>
          <Link
            href="/dashboard/bookings"
            className="text-sm text-primary hover:underline"
          >
            Lihat semua
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {pendingBookings.length > 0 ? (
            pendingBookings.map((booking) => (
              <PendingBookingCard
                key={booking.id}
                id={booking.id}
                customerName={booking.customer_name}
                courtName={booking.court_name}
                startTime={booking.start_time}
                endTime={booking.end_time}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Tidak ada booking yang perlu dikonfirmasi.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Jadwal Minggu Ini</h2>
        <WeeklySchedule days={weekData} />
      </section>
    </>
  );
}
