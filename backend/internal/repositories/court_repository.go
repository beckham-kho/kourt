package repositories

import "github.com/beckham-kho/kourt/internal/models"

type CourtsRepository interface {
	FindAll(search string) ([]models.Courts, error)
	FindByID(id string) (*models.Courts, error)
	AddImage(courtID, imageURL string, isPrimary bool) error
	DeleteImage(imageID string) error
}