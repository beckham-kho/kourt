export interface Court {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  type: string;
  court_count: number;
  owner_id: string;
  owner_name: string;
  images: CourtImage[];
  facilities: CourtFacility[];
}

export interface CourtImage {
  id: string;
  court_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface CourtFacility {
  id: string;
  name: string;
  icon: string;
}
