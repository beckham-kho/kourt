import { getAccessToken } from "@/lib/auth-server";
import { getOwnerBookings } from "@/lib/bookings";
import BookingRow from "@/components/dashboard/booking-row";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";

const STATUS_TABS = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "completed", label: "Selesai" },
  { value: "rejected", label: "Ditolak" },
];

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status ?? "all";

  const token = await getAccessToken();
  if (!token) {
    redirect("/login");
  }

  const bookings = await getOwnerBookings(token, activeStatus);

  return (
    <>
      <h1 className="text-2xl font-bold mt-4 mb-3">Booking Masuk</h1>

      <Tabs defaultValue={activeStatus}>
        <TabsList className="w-full overflow-x-auto justify-start sm:justify-center">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              render={<a href={`/dashboard/bookings?status=${tab.value}`} />}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeStatus} className="mt-4">
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookings.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-16">
              Tidak ada booking dengan status ini.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
