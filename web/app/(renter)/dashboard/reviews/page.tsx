import { getAccessToken } from "@/lib/auth-server";
import { getOwnerReviews } from "@/lib/reviews";
import ReviewSummaryPanel from "@/components/dashboard/review-summary-panel";
import ReviewFilters from "@/components/dashboard/review-filters";
import { redirect } from "next/navigation";
import OwnerReviewCard from "@/components/dashboard/owner-review-card";

export default async function OwnerReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; rating?: string }>;
}) {
  const { sort = "newest", rating = "all" } = await searchParams;

  const token = await getAccessToken();
  if (!token) {
    redirect("/login");
  }

  const allReviews = await getOwnerReviews(token);

  let filteredReviews = allReviews;
  if (rating !== "all") {
    filteredReviews = filteredReviews.filter(
      (r) => r.rating === Number(rating),
    );
  }

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "newest":
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  return (
    <>
      <h1 className="text-2xl font-bold mt-4 mb-5">Ulasan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <ReviewSummaryPanel reviews={allReviews} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Menampilkan {sortedReviews.length} dari {allReviews.length} ulasan
            </p>
            <ReviewFilters sort={sort} rating={rating} />
          </div>

          {sortedReviews.length > 0 ? (
            <div className="flex flex-col gap-3">
              {sortedReviews.map((review) => (
                <OwnerReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-16">
              {allReviews.length === 0
                ? "Belum ada ulasan untuk lapangan-lapanganmu."
                : "Tidak ada ulasan dengan filter ini."}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
