import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getCourtById } from "@/lib/courts";
import { getCurrentUser } from "@/lib/auth-server";
import BookingForm from "@/components/booking/booking-form";
import { notFound, redirect } from "next/navigation";

export default async function BookCourtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [court, user] = await Promise.all([getCourtById(id), getCurrentUser()]);

  if (!court) {
    notFound();
  }

  if (!user) {
    redirect(`/login?redirect=/courts/${id}/book`);
  }

  return (
    <>
      <Navbar user={user} />
      <section className="p-4 md:px-10 lg:px-20 md:py-7">
        <h1 className="text-2xl font-bold mb-1">Booking {court.name}</h1>
        <p className="text-muted-foreground mb-6">{court.location}</p>
        <BookingForm court={court} />
      </section>
      <Footer />
    </>
  );
}
