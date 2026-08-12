package services

import (
	"errors"
	"time"

	"github.com/beckham-kho/kourt/internal/models"
	"github.com/beckham-kho/kourt/internal/repositories"
)

type BookingService struct {
	bookingRepo repositories.BookingRepository
	courtRepo   repositories.CourtsRepository
}

func NewBookingService(bookingRepo repositories.BookingRepository, courtRepo repositories.CourtsRepository) *BookingService {
	return &BookingService{bookingRepo: bookingRepo, courtRepo: courtRepo}
}

func (s *BookingService) CreateBooking(customerID string, input models.CreateBookingInput) (*models.Booking, error) {
	if !input.EndTime.After(input.StartTime) {
		return nil, errors.New("waktu selesai harus setelah waktu mulai")
	}

	if input.StartTime.Before(time.Now()) {
		return nil, errors.New("tidak bisa booking di waktu yang sudah lewat")
	}

	court, err := s.courtRepo.FindByID(input.CourtID)
	if err != nil {
		return nil, errors.New("lapangan tidak ditemukan")
	}

	conflict, err := s.bookingRepo.HasConflict(input.CourtID, input.StartTime, input.EndTime)
	if err != nil {
		return nil, err
	}
	if conflict {
		return nil, errors.New("slot waktu ini sudah dibooking")
	}

	duration := input.EndTime.Sub(input.StartTime).Hours()
	totalPrice := court.Price * duration

	booking := &models.Booking{
		CourtID:    input.CourtID,
		CustomerID: customerID,
		StartTime:  input.StartTime,
		EndTime:    input.EndTime,
		Status:     "pending",
		TotalPrice: totalPrice,
	}

	if err := s.bookingRepo.Create(booking); err != nil {
		return nil, err
	}

	return booking, nil
}

func (s *BookingService) GetOwnerBookings(ownerID string, status string) ([]models.Booking, error) {
	return s.bookingRepo.FindByOwnerID(ownerID, status)
}

func (s *BookingService) GetCustomerBookings(customerID string) ([]models.Booking, error) {
	return s.bookingRepo.FindByCustomerID(customerID)
}

func (s *BookingService) GetWeeklySchedule(ownerID string, start, end time.Time) ([]models.Booking, error) {
	return s.bookingRepo.FindByOwnerIDAndDateRange(ownerID, start, end)
}

func (s *BookingService) UpdateStatus(id string, ownerID string, status string) error {
	booking, err := s.bookingRepo.FindByID(id)
	if err != nil {
		return errors.New("booking tidak ditemukan")
	}

	court, err := s.courtRepo.FindByID(booking.CourtID)
	if err != nil {
		return errors.New("lapangan tidak ditemukan")
	}

	if court.OwnerID != ownerID {
		return errors.New("kamu tidak punya izin untuk mengubah booking ini")
	}

	validStatuses := map[string]bool{
		"confirmed": true, "rejected": true, "completed": true, "cancelled": true,
	}
	if !validStatuses[status] {
		return errors.New("status tidak valid")
	}

	return s.bookingRepo.UpdateStatus(id, status)
}

func (s *BookingService) GetStats(ownerID string) (*models.BookingStats, error) {
	return s.bookingRepo.GetStats(ownerID)
}