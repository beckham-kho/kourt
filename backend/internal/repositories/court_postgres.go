package repositories

import (
	"database/sql"
	"errors"

	"github.com/beckham-kho/kourt/internal/models"
)

type CourtsPostgres struct {
	db *sql.DB
}

func NewCourtsPostgres(db *sql.DB) *CourtsPostgres {
	return &CourtsPostgres{db: db}
}

func (r *CourtsPostgres) Create(ownerID string, input models.CreateCourtInput) (*models.Courts, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	var court models.Courts
	err = tx.QueryRow(`
		INSERT INTO courts (owner_id, name, description, location, price, type, court_count)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`, ownerID, input.Name, input.Description, input.Location, input.Price, input.Type, input.CourtCount).Scan(&court.ID)
	if err != nil {
		return nil, err
	}

	for _, facilityID := range input.FacilityIDs {
		_, err = tx.Exec(`INSERT INTO court_facilities (court_id, facility_id) VALUES ($1, $2)`, court.ID, facilityID)
		if err != nil {
			return nil, err
		}
	}

	for i, imageURL := range input.ImageURLs {
		_, err = tx.Exec(
			`INSERT INTO court_images (court_id, image_url, is_primary, display_order) VALUES ($1, $2, $3, $4)`,
			court.ID, imageURL, i == 0, i,
		)
		if err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &court, nil
}

func (r *CourtsPostgres) Delete(courtID string, ownerID string) error {
	result, err := r.db.Exec(`DELETE FROM courts WHERE id = $1 AND owner_id = $2`, courtID, ownerID)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return errors.New("lapangan tidak ditemukan atau bukan milikmu")
	}

	return nil
}

func (r *CourtsPostgres) Update(courtID string, ownerID string, input models.UpdateCourtInput) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	result, err := tx.Exec(`
		UPDATE courts
		SET name = $1, description = $2, location = $3, price = $4, type = $5, court_count = $6
		WHERE id = $7 AND owner_id = $8
	`, input.Name, input.Description, input.Location, input.Price, input.Type, input.CourtCount, courtID, ownerID)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return errors.New("lapangan tidak ditemukan atau bukan milikmu")
	}

	_, err = tx.Exec(`DELETE FROM court_facilities WHERE court_id = $1`, courtID)
	if err != nil {
		return err
	}

	for _, facilityID := range input.FacilityIDs {
		_, err = tx.Exec(`INSERT INTO court_facilities (court_id, facility_id) VALUES ($1, $2)`, courtID, facilityID)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func (r *CourtsPostgres) FindAll(search string) ([]models.Courts, error) {
	query := `
		SELECT c.id, c.name, c.description, c.location, c.price, c.type, c.court_count, c.owner_id, c.is_active, u.name
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
		if err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.Location, &c.Price, &c.Type, &c.CourtCount, &c.OwnerID, &c.IsActive, &c.OwnerName ); err != nil {
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
    SELECT c.id, c.name, c.description, c.location, c.price, c.type, c.court_count, c.owner_id, c.is_active,  u.name
    FROM courts c
    JOIN users u ON u.id = c.owner_id
    WHERE c.id = $1
	`

	var c models.Courts
	err := r.db.QueryRow(query, id).Scan(&c.ID, &c.Name, &c.Description, &c.Location, &c.Price, &c.Type, &c.CourtCount, &c.OwnerID, &c.IsActive, &c.OwnerName)
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

func (r *CourtsPostgres) FindByOwnerID(ownerID string) ([]models.Courts, error) {
	query := `
		SELECT c.id, c.name, c.description, c.location, c.price, c.type, c.court_count, c.is_active,
		       COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0), COUNT(DISTINCT r.id)
		FROM courts c
		LEFT JOIN reviews r ON r.court_id = c.id
		WHERE c.owner_id = $1
		GROUP BY c.id
		ORDER BY c.name
	`

	rows, err := r.db.Query(query, ownerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	courts := []models.Courts{}
	for rows.Next() {
		var c models.Courts
		if err := rows.Scan(
			&c.ID, &c.Name, &c.Description, &c.Location, &c.Price, &c.Type, &c.CourtCount,
			&c.IsActive, &c.AverageRating, &c.TotalReviews,
		); err != nil {
			return nil, err
		}
		c.OwnerID = ownerID
		courts = append(courts, c)
	}

	for i := range courts {
		images, err := r.getCourtImages(courts[i].ID, true)
		if err != nil {
			return nil, err
		}
		courts[i].Images = images
	}

	return courts, nil
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

func (r *CourtsPostgres) CountActiveBookings(courtID string) (int, error) {
	var count int
	err := r.db.QueryRow(`
		SELECT COUNT(*) FROM bookings
		WHERE court_id = $1
		  AND status IN ('pending', 'confirmed')
		  AND start_time > now()
	`, courtID).Scan(&count)
	return count, err
}

func (r *CourtsPostgres) UpdateActiveStatus(courtID string, ownerID string, isActive bool) error {
	result, err := r.db.Exec(
		`UPDATE courts SET is_active = $1 WHERE id = $2 AND owner_id = $3`,
		isActive, courtID, ownerID,
	)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return errors.New("lapangan tidak ditemukan atau bukan milikmu")
	}

	return nil
}