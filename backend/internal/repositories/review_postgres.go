package repositories

import (
	"database/sql"

	"github.com/beckham-kho/kourt/internal/models"
)

type ReviewPostgres struct {
	db *sql.DB
}

func NewReviewPostgres(db *sql.DB) *ReviewPostgres {
	return &ReviewPostgres{db: db}
}

func (r *ReviewPostgres) FindByCourtID(courtID string) ([]models.Review, error) {
	query := `
		SELECT r.id, r.court_id, r.user_id, u.name, r.rating, r.comment, r.created_at
		FROM reviews r
		JOIN users u ON u.id = r.user_id
		WHERE r.court_id = $1
		ORDER BY r.created_at DESC
	`

	rows, err := r.db.Query(query, courtID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reviews := []models.Review{}
	for rows.Next() {
		var rv models.Review
		if err := rows.Scan(&rv.ID, &rv.CourtID, &rv.UserID, &rv.UserName, &rv.Rating, &rv.Comment, &rv.CreatedAt); err != nil {
			return nil, err
		}
		reviews = append(reviews, rv)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	for i := range reviews {
		categories, err := r.getCategoryRatings(reviews[i].ID)
		if err != nil {
			return nil, err
		}
		reviews[i].Categories = categories
	}

	return reviews, nil
}

func (r *ReviewPostgres) getCategoryRatings(reviewID string) ([]models.ReviewCategoryRating, error) {
	query := `
		SELECT rc.id, rc.name, rcr.score
		FROM review_category_ratings rcr
		JOIN review_categories rc ON rc.id = rcr.category_id
		WHERE rcr.review_id = $1
	`

	rows, err := r.db.Query(query, reviewID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categories := []models.ReviewCategoryRating{}
	for rows.Next() {
		var c models.ReviewCategoryRating
		if err := rows.Scan(&c.CategoryID, &c.CategoryName, &c.Score); err != nil {
			return nil, err
		}
		categories = append(categories, c)
	}

	return categories, nil
}

func (r *ReviewPostgres) GetRatingSummary(courtID string) (*models.RatingSummary, error) {
	summary := &models.RatingSummary{
		Distribution: []models.RatingBucket{},
		Categories:   []models.CategoryAverage{},
	}

	err := r.db.QueryRow(
		`SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0), COUNT(*) FROM reviews WHERE court_id = $1`,
		courtID,
	).Scan(&summary.AverageRating, &summary.TotalReviews)
	if err != nil {
		return nil, err
	}

	distRows, err := r.db.Query(
		`SELECT rating, COUNT(*) FROM reviews WHERE court_id = $1 GROUP BY rating ORDER BY rating DESC`,
		courtID,
	)
	if err != nil {
		return nil, err
	}
	defer distRows.Close()

	counts := map[int16]int{}
	for distRows.Next() {
		var star int16
		var count int
		if err := distRows.Scan(&star, &count); err != nil {
			return nil, err
		}
		counts[star] = count
	}

	for star := int16(5); star >= 1; star-- {
		summary.Distribution = append(summary.Distribution, models.RatingBucket{
			Star:    star,
			Reviews: counts[star],
		})
	}

	catRows, err := r.db.Query(`
		SELECT rc.name, ROUND(AVG(rcr.score)::numeric, 1)
		FROM review_category_ratings rcr
		JOIN review_categories rc ON rc.id = rcr.category_id
		JOIN reviews rv ON rv.id = rcr.review_id
		WHERE rv.court_id = $1
		GROUP BY rc.name
	`, courtID)
	if err != nil {
		return nil, err
	}
	defer catRows.Close()

	for catRows.Next() {
		var c models.CategoryAverage
		if err := catRows.Scan(&c.Name, &c.AverageScore); err != nil {
			return nil, err
		}
		summary.Categories = append(summary.Categories, c)
	}

	return summary, nil
}