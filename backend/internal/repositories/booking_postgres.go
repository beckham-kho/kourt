package repositories

import (
	"database/sql"
	"time"

	"github.com/beckham-kho/kourt/internal/models"
)

type BookingPostgres struct {
	db *sql.DB
}

func NewBookingPostgres(db *sql.DB) *BookingPostgres {
	return &BookingPostgres{db: db}
}

func (r *BookingPostgres) Create(booking *models.Booking) error {
	query := `
		INSERT INTO bookings (court_id, customer_id, start_time, end_time, status, total_price)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at
	`
	return r.db.QueryRow(
		query, booking.CourtID, booking.CustomerID, booking.StartTime, booking.EndTime, booking.Status, booking.TotalPrice,
	).Scan(&booking.ID, &booking.CreatedAt)
}

func (r *BookingPostgres) FindByID(id string) (*models.Booking, error) {
	query := `
		SELECT b.id, b.court_id, c.name, b.customer_id, u.name, b.start_time, b.end_time, b.status, b.total_price, b.created_at
		FROM bookings b
		JOIN courts c ON c.id = b.court_id
		JOIN users u ON u.id = b.customer_id
		WHERE b.id = $1
	`
	var bk models.Booking
	err := r.db.QueryRow(query, id).Scan(
		&bk.ID, &bk.CourtID, &bk.CourtName, &bk.CustomerID, &bk.CustomerName,
		&bk.StartTime, &bk.EndTime, &bk.Status, &bk.TotalPrice, &bk.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &bk, nil
}

func (r *BookingPostgres) FindByOwnerID(ownerID string, status string) ([]models.Booking, error) {
	query := `
		SELECT b.id, b.court_id, c.name, b.customer_id, u.name, b.start_time, b.end_time, b.status, b.total_price, b.created_at
		FROM bookings b
		JOIN courts c ON c.id = b.court_id
		JOIN users u ON u.id = b.customer_id
		WHERE c.owner_id = $1
	`
	args := []interface{}{ownerID}

	if status != "" {
		query += ` AND b.status = $2`
		args = append(args, status)
	}
	query += ` ORDER BY b.start_time ASC`

	return r.scanBookings(query, args...)
}

func (r *BookingPostgres) FindByCustomerID(customerID string) ([]models.Booking, error) {
	query := `
		SELECT b.id, b.court_id, c.name, b.customer_id, u.name, b.start_time, b.end_time, b.status, b.total_price, b.created_at
		FROM bookings b
		JOIN courts c ON c.id = b.court_id
		JOIN users u ON u.id = b.customer_id
		WHERE b.customer_id = $1
		ORDER BY b.start_time DESC
	`
	return r.scanBookings(query, customerID)
}

func (r *BookingPostgres) FindByOwnerIDAndDateRange(ownerID string, start, end time.Time) ([]models.Booking, error) {
	query := `
		SELECT b.id, b.court_id, c.name, b.customer_id, u.name, b.start_time, b.end_time, b.status, b.total_price, b.created_at
		FROM bookings b
		JOIN courts c ON c.id = b.court_id
		JOIN users u ON u.id = b.customer_id
		WHERE c.owner_id = $1
		AND b.start_time >= $2
		AND b.start_time < $3
		AND b.status IN ('confirmed', 'completed')
		ORDER BY b.start_time ASC
	`
	return r.scanBookings(query, ownerID, start, end)
}

func (r *BookingPostgres) scanBookings(query string, args ...interface{}) ([]models.Booking, error) {
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	bookings := []models.Booking{}
	for rows.Next() {
		var bk models.Booking
		if err := rows.Scan(
			&bk.ID, &bk.CourtID, &bk.CourtName, &bk.CustomerID, &bk.CustomerName,
			&bk.StartTime, &bk.EndTime, &bk.Status, &bk.TotalPrice, &bk.CreatedAt,
		); err != nil {
			return nil, err
		}
		bookings = append(bookings, bk)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (r *BookingPostgres) UpdateStatus(id string, status string) error {
	_, err := r.db.Exec(
		`UPDATE bookings SET status = $1, updated_at = now() WHERE id = $2`,
		status, id,
	)
	return err
}

func (r *BookingPostgres) HasConflict(courtID string, start, end time.Time) (bool, error) {
	query := `
		SELECT EXISTS(
			SELECT 1 FROM bookings
			WHERE court_id = $1
			AND status IN ('pending', 'confirmed')
			AND start_time < $2
			AND end_time > $3
		)
	`
	var exists bool
	err := r.db.QueryRow(query, courtID, end, start).Scan(&exists)
	return exists, err
}

func (r *BookingPostgres) GetStats(ownerID string) (*models.BookingStats, error) {
	stats := &models.BookingStats{}

	err := r.db.QueryRow(`
		SELECT COUNT(*) FROM bookings b
		JOIN courts c ON c.id = b.court_id
		WHERE c.owner_id = $1
		AND b.start_time >= date_trunc('week', now())
		AND b.start_time < date_trunc('week', now()) + interval '1 week'
	`, ownerID).Scan(&stats.TotalBookingsThisWeek)
	if err != nil {
		return nil, err
	}

	err = r.db.QueryRow(`
		SELECT COALESCE(SUM(total_price), 0) FROM bookings b
		JOIN courts c ON c.id = b.court_id
		WHERE c.owner_id = $1
		AND b.status = 'completed'
		AND date_trunc('month', b.start_time) = date_trunc('month', now())
	`, ownerID).Scan(&stats.RevenueThisMonth)
	if err != nil {
		return nil, err
	}

	err = r.db.QueryRow(`SELECT COUNT(*) FROM courts WHERE owner_id = $1`, ownerID).Scan(&stats.ActiveCourts)
	if err != nil {
		return nil, err
	}

	err = r.db.QueryRow(`
		SELECT COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) FROM reviews r
		JOIN courts c ON c.id = r.court_id
		WHERE c.owner_id = $1
	`, ownerID).Scan(&stats.AverageRating)
	if err != nil {
		return nil, err
	}

	return stats, nil
}