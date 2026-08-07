package repositories

import "github.com/beckham-kho/kourt/internal/models"

type ReviewRepository interface {
	FindByCourtID(courtID string) ([]models.Review, error)
	GetRatingSummary(courtID string) (*models.RatingSummary, error)
}