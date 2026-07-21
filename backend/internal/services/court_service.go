package services

import (
	"github.com/beckham-kho/kourt/internal/models"
	"github.com/beckham-kho/kourt/internal/repositories"
)

type CourtService struct {
	repo repositories.CourtRepository
}

func NewCourtService(repo repositories.CourtRepository) *CourtService {
	return &CourtService{repo: repo}
}

func (s *CourtService) GetAllCourts() ([]models.Court, error) {
	return s.repo.FindAll()
}