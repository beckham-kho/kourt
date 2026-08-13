package services

import (
	"context"
	"fmt"
	"mime/multipart"

	"github.com/beckham-kho/kourt/internal/models"
	"github.com/beckham-kho/kourt/internal/repositories"
)

type CourtService struct {
	repo        repositories.CourtsRepository
	storageRepo repositories.StorageRepository
}

func NewCourtService(repo repositories.CourtsRepository, storageRepo repositories.StorageRepository) *CourtService {
	return &CourtService{repo: repo, storageRepo: storageRepo}
}

func (s *CourtService) CreateCourt(ownerID string, input models.CreateCourtInput) (*models.Courts, error) {
	return s.repo.Create(ownerID, input)
}

func (s *CourtService) DeleteCourt(courtID string, ownerID string) error {
	activeBookings, err := s.repo.CountActiveBookings(courtID)
	if err != nil {
		return err
	}

	if activeBookings > 0 {
		return fmt.Errorf("lapangan masih punya %d booking aktif, tidak bisa dihapus", activeBookings)
	}

	return s.repo.Delete(courtID, ownerID)
}

func (s *CourtService) UpdateCourt(courtID string, ownerID string, input models.UpdateCourtInput) error {
	return s.repo.Update(courtID, ownerID, input)
}

func (s *CourtService) GetAllCourts(search string) ([]models.Courts, error) {
	return s.repo.FindAll(search)
}

func (s *CourtService) GetCourtByID(id string) (*models.Courts, error) {
	return s.repo.FindByID(id)
}

func (s *CourtService) GetCourtsByOwner(ownerID string) ([]models.Courts, error) {
	return s.repo.FindByOwnerID(ownerID)
}

func (s *CourtService) UploadCourtImage(ctx context.Context, courtID string, file multipart.File, header *multipart.FileHeader, isPrimary bool) (string, error) {
	url, err := s.storageRepo.Upload(ctx, file, header, "courts")
	if err != nil {
		return "", err
	}

	if err := s.repo.AddImage(courtID, url, isPrimary); err != nil {
		return "", err
	}

	return url, nil
}

func (s *CourtService) DeleteCourtImage(imageID string) error {
	return s.repo.DeleteImage(imageID)
}

func (s *CourtService) ToggleCourtActive(courtID string, ownerID string, isActive bool) error {
	return s.repo.UpdateActiveStatus(courtID, ownerID, isActive)
}