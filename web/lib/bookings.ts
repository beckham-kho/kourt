import { Booking, BookingStats } from "@/types/booking";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

async function authFetch<T>(
  endpoint: string,
  token: string,
): Promise<T | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const result: ApiResponse<T> = await res.json();
  return result.data;
}

export async function getOwnerStats(
  token: string,
): Promise<BookingStats | null> {
  return authFetch<BookingStats>("/bookings/owner/stats", token);
}

export async function getPendingBookings(token: string): Promise<Booking[]> {
  const data = await authFetch<Booking[]>(
    "/bookings/owner?status=pending",
    token,
  );
  return data ?? [];
}

export async function getWeeklySchedule(
  token: string,
  startDate: Date,
): Promise<Booking[]> {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const data = await authFetch<Booking[]>(
    `/bookings/owner/schedule?start=${start.toISOString()}`,
    token,
  );
  return data ?? [];
}
