package repositories

import (
	"database/sql"

	"github.com/beckham-kho/kourt/internal/models"
)

type CourtPostgres struct {
	db *sql.DB
}

func NewCourtPostgres(db *sql.DB) *CourtPostgres {
	return &CourtPostgres{db: db}
}

func (r *CourtPostgres) FindAll() ([]models.Court, error) {
	query := `SELECT id, name, description, location status FROM court`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courts []models.Court
	for rows.Next() {
		var c models.Court
		if err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.Location); err != nil {
			return nil, err
		}
		courts = append(courts, c)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return courts, nil
}