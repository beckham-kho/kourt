package repositories

import (
	"database/sql"

	"github.com/beckham-kho/kourt/internal/models"
)

type CourtsPostgres struct {
	db *sql.DB
}

func NewCourtsPostgres(db *sql.DB) *CourtsPostgres {
	return &CourtsPostgres{db: db}
}

func (r *CourtsPostgres) FindAll(search string) ([]models.Courts, error) {
	query := `
		SELECT c.id, c.name, c.description, c.location, c.price, c.type, c.court_count, c.owner_id, u.name
		FROM courts c
		JOIN users u ON u.id = c.owner_id
	`
	args := []interface{}{}

	if search != "" {
		query += ` WHERE name ILIKE $1`
		args = append(args, "%"+search+"%")
	}

	rows, err := r.db.Query(query,args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	courts := []models.Courts{}
	for rows.Next() {
		var c models.Courts
		if err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.Location, &c.Price, &c.Type, &c.CourtCount, &c.OwnerID, &c.OwnerName ); err != nil {
			return nil, err
		}
		courts = append(courts, c)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	for i := range courts {
		images, imageErr := r.getCourtImages(courts[i].ID, true)
		facilities, facilityErr := r.getCourtFacilities(courts[i].ID)
		if imageErr != nil {
			return nil, imageErr
		}
		if facilityErr != nil {
			return nil, facilityErr
		}
		courts[i].Images = images
		courts[i].Facilities = facilities
	}

	return courts, nil
}

func (r *CourtsPostgres) FindByID(id string) (*models.Courts, error) {
	query := `
    SELECT c.id, c.name, c.description, c.location, c.price, c.type, c.court_count, c.owner_id, u.name
    FROM courts c
    JOIN users u ON u.id = c.owner_id
    WHERE c.id = $1
	`

	var c models.Courts
	err := r.db.QueryRow(query, id).Scan(&c.ID, &c.Name, &c.Description, &c.Location, &c.Price, &c.Type, &c.CourtCount, &c.OwnerID, &c.OwnerName)
	if err != nil {
		return nil, err
	}

	images, err := r.getCourtImages(c.ID, false)
	if err != nil {
		return nil, err
	}
	c.Images = images

	facilities, err := r.getCourtFacilities(c.ID)
	if err != nil {
		return nil, err
	}
	c.Facilities = facilities

	return &c, nil
}

func (r *CourtsPostgres) AddImage(courtID, imageURL string, isPrimary bool) error {
	_, err := r.db.Exec(`INSERT INTO court_images (court_id, image_url, is_primary) VALUES ($1, $2, $3)`, courtID, imageURL, isPrimary)
	return err
}

func (r *CourtsPostgres) DeleteImage(imageID string) error {
	_, err := r.db.Exec(`DELETE FROM court_images WHERE id = $1`, imageID)
	return err
}

func (r *CourtsPostgres) getCourtImages(courtID string, primaryOnly bool) ([]models.CourtImage, error) {
	query := `SELECT id, court_id, image_url, is_primary, display_order FROM court_images WHERE court_id = $1`

	if primaryOnly {
		query += ` AND is_primary = true`
	}
	query += ` ORDER BY display_order ASC`

	rows, err := r.db.Query(query, courtID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	images := []models.CourtImage{}

	for rows.Next() {
		var img models.CourtImage

		if err := rows.Scan(&img.ID, &img.CourtID, &img.ImageURL, &img.IsPrimary, &img.DisplayOrder);
		err != nil {
			return nil, err
		}
		images = append(images, img)
	}

	return images, nil
}

func (r *CourtsPostgres) getCourtFacilities(courtID string) ([]models.Facility, error) {
	query := `
		SELECT f.id, f.name, f.icon 
		FROM facilities f
		JOIN court_facilities cf ON cf.facility_id = f.id
		WHERE cf.court_id = $1
	`

	rows, err := r.db.Query(query, courtID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	facilities := []models.Facility{}

	for rows.Next() {
		var facility models.Facility

		if err := rows.Scan(&facility.ID, &facility.Name, &facility.Icon); err != nil {
			return nil, err
		}
		facilities = append(facilities, facility)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return facilities, nil
}