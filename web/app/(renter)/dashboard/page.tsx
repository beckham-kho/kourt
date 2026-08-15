import StatCard from "@/components/dashboard/stat-card";
import WeeklySchedule from "@/components/dashboard/weekly-schedule";
import { CalendarCheck, Wallet, Building2, Star } from "lucide-react";
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
        <h2 className="text-xl font-semibold mb-3">Jadwal Minggu Ini</h2>
        <WeeklySchedule days={weekData} />
      </section>
    </>
  );
}
