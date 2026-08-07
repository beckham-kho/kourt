import { Star } from "lucide-react";
import { Review } from "@/types/review";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function CourtReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mt-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex flex-col gap-1 border rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{review.user_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5"
                  fill={i < review.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.created_at)}
            </span>
          </div>
          {review.comment && (
            <p className="text-sm text-muted-foreground mt-1">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
