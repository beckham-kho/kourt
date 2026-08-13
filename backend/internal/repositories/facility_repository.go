package repositories

import (
	"database/sql"

	"github.com/beckham-kho/kourt/internal/models"
)

type FacilityPostgres struct {
	db *sql.DB
}

type FacilityRepository interface {
	FindAll() ([]models.Facility, error)
}

func NewFacilityPostgres(db *sql.DB) *FacilityPostgres {
	return &FacilityPostgres{db: db}
}

func (r *FacilityPostgres) FindAll() ([]models.Facility, error) {
	rows, err := r.db.Query(`SELECT id, name, icon FROM facilities ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	facilities := []models.Facility{}
	for rows.Next() {
		var f models.Facility
		if err := rows.Scan(&f.ID, &f.Name, &f.Icon); err != nil {
			return nil, err
		}
		facilities = append(facilities, f)
	}

	return facilities, nil
}