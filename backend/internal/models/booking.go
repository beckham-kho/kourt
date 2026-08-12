package models

import "time"

type Booking struct {
	ID          string    `json:"id"`
	CourtID     string    `json:"court_id"`
	CourtName   string    `json:"court_name"`
	CustomerID  string    `json:"customer_id"`
	CustomerName string  `json:"customer_name"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	Status      string    `json:"status"`
	TotalPrice  float64   `json:"total_price"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateBookingInput struct {
	CourtID   string    `json:"court_id"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
}

type UpdateBookingStatusInput struct {
	Status string `json:"status"`
}

type BookingStats struct {
	TotalBookingsThisWeek int     `json:"total_bookings_this_week"`
	RevenueThisMonth      float64 `json:"revenue_this_month"`
	ActiveCourts          int     `json:"active_courts"`
	AverageRating         float64 `json:"average_rating"`
}