package repositories

import (
	"time"

	"github.com/beckham-kho/kourt/internal/models"
)

type BookingRepository interface {
	Create(booking *models.Booking) error
	FindByID(id string) (*models.Booking, error)
	FindByOwnerID(ownerID string, status string) ([]models.Booking, error)
	FindByCustomerID(customerID string) ([]models.Booking, error)
	FindByOwnerIDAndDateRange(ownerID string, start, end time.Time) ([]models.Booking, error)
	UpdateStatus(id string, status string) error
	HasConflict(courtID string, start, end time.Time) (bool, error)
	GetStats(ownerID string) (*models.BookingStats, error)
}