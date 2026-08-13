package models

type Courts struct {
	ID            string       `json:"id"`
	Name          string       `json:"name"`
	Description   string       `json:"description"`
	Location      string       `json:"location"`
	Price         float64      `json:"price"`
	Type          string       `json:"type"`
	CourtCount    int          `json:"court_count"`
	IsActive      bool         `json:"is_active"`
	AverageRating float64      `json:"average_rating"`
	TotalReviews  int          `json:"total_reviews"`
	OwnerID       string       `json:"owner_id"`
	OwnerName     string       `json:"owner_name"`
	Images        []CourtImage `json:"images,omitempty"`
	Facilities    []Facility   `json:"facilities,omitempty"`
}

type CourtImage struct {
	ID           string `json:"id"`
	CourtID      string `json:"court_id"`
	ImageURL     string `json:"image_url"`
	IsPrimary    bool   `json:"is_primary"`
	DisplayOrder int    `json:"display_order"`
}

type CreateCourtInput struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Location    string   `json:"location"`
	Price       float64  `json:"price"`
	Type        string   `json:"type"`
	CourtCount  int      `json:"court_count"`
	FacilityIDs []string `json:"facility_ids"`
	ImageURLs   []string `json:"image_urls"`
}

type UpdateCourtInput struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Location    string   `json:"location"`
	Price       float64  `json:"price"`
	Type        string   `json:"type"`
	CourtCount  int      `json:"court_count"`
	FacilityIDs []string `json:"facility_ids"`
}