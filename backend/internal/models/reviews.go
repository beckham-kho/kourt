package models

import "time"

type Review struct {
	ID         string                 `json:"id"`
	CourtID    string                 `json:"court_id"`
	UserID     string                 `json:"user_id"`
	UserName   string                 `json:"user_name"`
	Rating     int16                  `json:"rating"`
	Comment    string                 `json:"comment"`
	Categories []ReviewCategoryRating `json:"categories,omitempty"`
	CreatedAt  time.Time              `json:"created_at"`
}

type ReviewCategoryRating struct {
	CategoryID   string `json:"category_id"`
	CategoryName string `json:"category_name"`
	Score        int16  `json:"score"`
}

type RatingSummary struct {
	AverageRating float64            `json:"average_rating"`
	TotalReviews  int                `json:"total_reviews"`
	Distribution  []RatingBucket     `json:"distribution"`
	Categories    []CategoryAverage  `json:"categories"`
}

type RatingBucket struct {
	Star    int16 `json:"star"`
	Reviews int   `json:"reviews"`
}

type CategoryAverage struct {
	Name          string  `json:"name"`
	AverageScore  float64 `json:"average_score"`
}