import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";
import { Review } from "@/types/review";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function OwnerReviewCard({ review }: { review: Review }) {
  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar>
            <AvatarFallback>
              {review.user_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold truncate">{review.user_name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-3.5 w-3.5"
              fill={i < review.rating ? "currentColor" : "none"}
            />
          ))}
        </div>
      </div>

      {review.comment && (
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      )}

      <Link
        href={`/dashboard/courts/${review.court_id}/edit`}
        className="w-fit"
      >
        <Badge variant="secondary" className="hover:bg-secondary/80">
          {review.court_name}
        </Badge>
      </Link>
    </Card>
  );
}
