import { Review, RatingSummary } from "@/types/review";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getCourtReviews(courtId: string): Promise<Review[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courts/${courtId}/reviews`,
    {
      cache: "no-store",
    },
  );

  const result: ApiResponse<Review[]> = await res.json();

  if (!res.ok) {
    return [];
  }

  return result.data ?? [];
}

export async function getCourtRatingSummary(
  courtId: string,
): Promise<RatingSummary | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courts/${courtId}/reviews/summary`,
    {
      cache: "no-store",
    },
  );

  const result: ApiResponse<RatingSummary> = await res.json();

  if (!res.ok) {
    return null;
  }

  return result.data;
}
