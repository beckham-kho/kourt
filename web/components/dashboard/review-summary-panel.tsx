import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Review } from "@/types/review";

export default function ReviewSummaryPanel({ reviews }: { reviews: Review[] }) {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  const courtCounts = reviews.reduce<
    Record<string, { name: string; count: number }>
  >((acc, r) => {
    if (!acc[r.court_id]) {
      acc[r.court_id] = { name: r.court_name, count: 0 };
    }
    acc[r.court_id].count++;
    return acc;
  }, {});

  const topCourts = Object.values(courtCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-6 border rounded-xl p-5 lg:sticky lg:top-20">
      <div className="flex flex-col items-center text-center gap-1">
        <p className="text-sm text-muted-foreground">Ulasan Pelanggan</p>
        <p className="text-4xl font-bold">{averageRating.toFixed(2)}</p>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4"
              fill={i < Math.round(averageRating) ? "currentColor" : "none"}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{totalReviews} Ulasan</p>
      </div>

      <div className="flex flex-col gap-2">
        {distribution.map((d) => (
          <div key={d.star} className="flex items-center gap-2">
            <span className="text-xs w-3 shrink-0">{d.star}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
            <Progress value={d.percentage} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
              {Math.round(d.percentage)}%
            </span>
          </div>
        ))}
      </div>

      {topCourts.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm">Ulasan Terbanyak</p>
          {topCourts.map((court, i) => (
            <div
              key={court.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="h-5 w-5 rounded-full border flex items-center justify-center text-xs shrink-0">
                  {i + 1}
                </span>
                <span className="truncate">{court.name}</span>
              </span>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                {court.count} ulasan
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
