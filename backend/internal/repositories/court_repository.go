package repositories

import "github.com/beckham-kho/kourt/internal/models"

type CourtsRepository interface {
	Create(ownerID string, input models.CreateCourtInput) (*models.Courts, error)
	Delete(courtID string, ownerID string) error
	Update(courtID string, ownerID string, input models.UpdateCourtInput) error
	FindAll(search string) ([]models.Courts, error)
	FindByID(id string) (*models.Courts, error)
	FindByOwnerID(ownerID string) ([]models.Courts, error)
	AddImage(courtID, imageURL string, isPrimary bool) error
	DeleteImage(imageID string) error
	UpdateActiveStatus(courtID string, ownerID string, isActive bool) error
	CountActiveBookings(courtID string) (int, error)
}