import { Booking, BookingStats } from "@/types/booking";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateBookingPayload {
  court_id: string;
  start_time: string;
  end_time: string;
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

export async function getOwnerBookings(
  token: string,
  status?: string,
): Promise<Booking[]> {
  const query = status && status !== "all" ? `?status=${status}` : "";
  const data = await authFetch<Booking[]>(`/bookings/owner${query}`, token);
  return data ?? [];
}

export async function getMyBookings(
  token: string,
  status?: string,
): Promise<Booking[]> {
  const query = status && status !== "all" ? `?status=${status}` : "";
  const data = await authFetch<Booking[]>(`/bookings/my${query}`, token);

  return data ?? [];
}

export async function cancelBooking(
  bookingId: string,
  token: string,
): Promise<boolean> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/cancel`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.ok;
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

export async function createBooking(payload: CreateBookingPayload) {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Gagal membuat booking");
  }

  return result.data;
}
