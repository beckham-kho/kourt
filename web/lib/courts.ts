import { Court } from "@/types/court";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function getCourts(search?: string): Promise<Court[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/courts`);
  if (search) {
    url.searchParams.set("search", search);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  const result: ApiResponse<Court[]> = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Gagal mengambil data lapangan");
  }

  return (result.data ?? []).filter((court) => court.is_active);
}

export async function getCourtById(id: string): Promise<Court | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courts/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  const result: ApiResponse<Court> = await res.json();

  if (!res.ok) {
    return null;
  }

  return result.data;
}

export async function getMyCourts(token: string): Promise<Court[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courts/owner/mine`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) return [];

  const result: ApiResponse<Court[]> = await res.json();
  return result.data ?? [];
}
