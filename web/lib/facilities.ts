import { CourtFacility } from "@/types/court";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getFacilities(): Promise<CourtFacility[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const result: ApiResponse<CourtFacility[]> = await res.json();
  return result.data ?? [];
}
