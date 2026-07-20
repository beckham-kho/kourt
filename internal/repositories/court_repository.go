package repositories

import "github.com/beckham-kho/kourt/internal/models"

type CourtRepository interface {
	FindAll() ([]models.Court, error)
}