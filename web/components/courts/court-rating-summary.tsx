import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { RatingSummary } from "@/types/review";

function formatCount(count: number) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}K`;
  }
  return count.toString();
}

export default function CourtRatingSummary({
  summary,
}: {
  summary: RatingSummary;
}) {
  const maxReviews = Math.max(...summary.distribution.map((r) => r.reviews), 1);

  if (summary.total_reviews === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada ulasan untuk lapangan ini.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
        <div className="flex flex-col items-start shrink-0">
          <span className="text-4xl font-bold">
            {summary.average_rating.toFixed(1)}
          </span>
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4"
                fill={
                  i < Math.round(summary.average_rating)
                    ? "currentColor"
                    : "none"
                }
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground mt-1">
            {formatCount(summary.total_reviews)} ratings
          </span>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {summary.distribution.map((item) => (
            <div key={item.star} className="flex items-center gap-3">
              <Progress
                value={(item.reviews / maxReviews) * 100}
                className="h-2 flex-1"
              />
              <span className="text-sm text-muted-foreground md:w-28 shrink-0">
                <span className="font-semibold text-foreground">
                  {item.star.toFixed(1)}
                </span>{" "}
                {formatCount(item.reviews)} reviews
              </span>
            </div>
          ))}
        </div>
      </div>

      {summary.categories.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {summary.categories.map((category) => (
            <div
              key={category.name}
              className="flex items-center gap-1.5 border rounded-full px-4 py-2 text-sm"
            >
              <span className="font-semibold text-green-600">
                {category.average_score.toFixed(1)}
              </span>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
