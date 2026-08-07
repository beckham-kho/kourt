package services

import (
	"context"
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

func (s *CourtService) GetAllCourts(search string) ([]models.Courts, error) {
	return s.repo.FindAll(search)
}

func (s *CourtService) GetCourtByID(id string) (*models.Courts, error) {
	return s.repo.FindByID(id)
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