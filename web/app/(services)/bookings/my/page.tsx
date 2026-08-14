import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { getCurrentUser, getAccessToken } from "@/lib/auth-server";
import { getMyBookings } from "@/lib/bookings";
import { redirect } from "next/navigation";
import BookingCard from "@/components/booking/booking-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_TABS = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "completed", label: "Selesai" },
  { value: "rejected", label: "Ditolak" },
] as const;

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const token = await getAccessToken();

  if (!token) {
    redirect("/login");
  }

  const { status } = await searchParams;
  const activeStatus = status ?? "all";

  const bookings = await getMyBookings(token, activeStatus);

  return (
    <>
      <Navbar user={user} />

      <section className="px-3 md:px-10 lg:px-20 py-6 md:py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-1">Booking Saya</h1>
        <p className="text-muted-foreground mb-6">
          Kelola dan pantau semua booking lapangan kamu di sini.
        </p>

        <Tabs defaultValue={activeStatus}>
          <TabsList className="mb-6">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                render={<a href={`/bookings/my?status=${tab.value}`} />}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeStatus}>
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium">Belum ada booking</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Booking lapangan pertamamu dan lihat riwayatnya di sini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </>
  );
}
