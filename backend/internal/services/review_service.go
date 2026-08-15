package services

import (
	"github.com/beckham-kho/kourt/internal/models"
	"github.com/beckham-kho/kourt/internal/repositories"
)

type ReviewService struct {
	repo repositories.ReviewRepository
}

func NewReviewService(repo repositories.ReviewRepository) *ReviewService {
	return &ReviewService{repo: repo}
}

func (s *ReviewService) GetReviewsByCourtID(courtID string) ([]models.Review, error) {
	return s.repo.FindByCourtID(courtID)
}

func (s *ReviewService) GetReviewsByOwnerID(ownerID string) ([]models.Review, error) {
	return s.repo.FindByOwnerID(ownerID)
}

func (s *ReviewService) GetRatingSummary(courtID string) (*models.RatingSummary, error) {
	return s.repo.GetRatingSummary(courtID)
}