import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Court } from "@/types/court";
import { Badge } from "../ui/badge";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CourtCard({ court }: { court: Court }) {
  const thumbnail = court.images?.[0].image_url;

  return (
    <Link href={`/courts/${court.id}`}>
      <Card className="overflow-hidden pt-0 gap-0 hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-video w-full bg-muted">
          <img
            src={thumbnail}
            alt={court.name}
            className="w-full h-full object-cover"
          />
          <div className="hidden md:block absolute bottom-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md">
            {formatPrice(court.price)}/jam
          </div>
        </div>
        <CardHeader className="gap-1 py-1">
          <CardTitle className="text-lg">{court.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {court.location}
          </CardDescription>
          <CardDescription>{court.description}</CardDescription>
          <CardDescription>
            <Badge className="mt-2 block md:hidden">
              {formatPrice(court.price)}/jam
            </Badge>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
