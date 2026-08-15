export interface ReviewCategoryRating {
  category_id: string;
  category_name: string;
  score: number;
}

export interface Review {
  id: string;
  court_id: string;
  court_name: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  categories?: ReviewCategoryRating[];
  created_at: string;
}

export interface RatingBucket {
  star: number;
  reviews: number;
}

export interface CategoryAverage {
  name: string;
  average_score: number;
}

export interface RatingSummary {
  average_rating: number;
  total_reviews: number;
  distribution: RatingBucket[];
  categories: CategoryAverage[];
}
