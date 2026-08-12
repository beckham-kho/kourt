export interface Booking {
  id: string;
  court_id: string;
  court_name: string;
  customer_id: string;
  customer_name: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled";
  total_price: number;
  created_at: string;
}

export interface BookingStats {
  total_bookings_this_week: number;
  revenue_this_month: number;
  active_courts: number;
  average_rating: number;
}
