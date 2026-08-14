import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { getCourtById } from "@/lib/courts";
import { getCourtRatingSummary, getCourtReviews } from "@/lib/reviews";
import {
  MapPin,
  ShowerHead,
  Utensils,
  Shirt,
  Car,
  Wifi,
  Moon,
  LucideIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import CourtGallery from "@/components/courts/court-gallery";
import CourtRatingSummary from "@/components/courts/court-rating-summary";
import CourtReviewsList from "@/components/courts/court-reviews-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser } from "@/lib/auth-server";
import Link from "next/link";
import BookingButton from "@/components/booking/booking-button";

const FACILITY_ICONS: Record<string, LucideIcon> = {
  "shower-head": ShowerHead,
  utensils: Utensils,
  shirt: Shirt,
  car: Car,
  wifi: Wifi,
  "moon-star": Moon,
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function CourtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [court, ratingSummary, reviews] = await Promise.all([
    getCourtById(id),
    getCourtRatingSummary(id),
    getCourtReviews(id),
  ]);

  if (!court) {
    notFound();
  }

  const user = await getCurrentUser();

  const bookingHref = user
    ? `/courts/${court.id}/book`
    : `/login?redirect=/courts/${court.id}/book`;

  return (
    <>
      <Navbar user={user} />

      <section className="flex flex-row md:px-10 lg:px-20 md:pt-7 pb-3 md:pb-2">
        <CourtGallery images={court.images} courtName={court.name} />
      </section>

      <section className="flex flex-col md:flex-row justify-between gap-5 px-3 md:px-10 lg:px-20">
        <div className="flex flex-col w-full flex-2">
          <h1 className="text-4xl font-bold">{court.name}</h1>
          <div className="flex gap-2 items-center">
            <p>{court.type}</p>
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <p>{court.court_count} lapang</p>
          </div>
          <p className="flex items-center gap-1 text-lg mt-1">
            <MapPin className="h-4 w-4" />
            {court.location}
          </p>

          <Separator className="mt-4 md:mt-7 w-full" />
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{court.owner_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-lg font-semibold my-5">
              Pemilik: {court.owner_name}
            </p>
          </div>
          <Separator className="w-full" />
          <p className="mt-4 md:mt-7">{court.description}</p>

          <Separator className="mt-4 md:mt-7 w-full" />
          <h2 className="text-2xl font-semibold mt-4 md:mt-7">Fasilitas</h2>
          <div className="flex flex-wrap flex-col gap-3 mt-3">
            {court.facilities.map((facility) => {
              const Icon = FACILITY_ICONS[facility.icon] ?? Wifi;
              return (
                <div key={facility.id} className="flex items-center gap-4">
                  <Icon className="h-8 w-8" />
                  <span>{facility.name}</span>
                </div>
              );
            })}
          </div>

          <Separator className="mt-4 md:mt-7 w-full" />
          <h2 className="text-2xl font-semibold mt-4 md:mt-7">
            Rating dan Ulasan
          </h2>
          <div className="mt-5">
            {ratingSummary ? (
              <CourtRatingSummary summary={ratingSummary} />
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada ulasan.</p>
            )}
            <CourtReviewsList reviews={reviews} />
          </div>
        </div>

        <div className="w-full hidden md:block flex-1">
          <div className="sticky top-20 flex flex-col p-5 bg-accent shadow-lg gap-3">
            <p className="text-2xl font-bold">{formatPrice(court.price)}/jam</p>
            <BookingButton
              courtId={court.id}
              isLoggedIn={!!user}
              className="p-2 w-full"
            >
              Booking Sekarang
            </BookingButton>
            <Button className="p-2 w-full" variant="outline">
              Hubungi Pemilik
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <div className="z-50 fixed left-0 bottom-0 w-full block md:hidden mt-5">
        <div className="flex flex-col p-3 bg-accent rounded-t-3xl border-2 gap-3">
          <p className="font-bold text-lg text-left">
            {formatPrice(court.price)}/jam
          </p>
          <div className="w-full flex flex-row gap-2">
            <Button className="flex-1 min-w-0 p-2" variant="outline">
              Hubungi Pemilik
            </Button>
            <BookingButton
              courtId={court.id}
              isLoggedIn={!!user}
              className="flex-1 min-w-0 p-2"
            >
              Booking Sekarang
            </BookingButton>
          </div>
        </div>
      </div>
    </>
  );
}
