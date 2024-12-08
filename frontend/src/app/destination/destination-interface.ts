export interface Tag {
  id: number;
  name: string;
}

export interface Destination {
  id: number;
  user: number;
  title: string;
  category: number;
  description: string;
  image: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  location: string;
  lat: string;
  lng: string;
  time: number;
  is_published: boolean;
  created_at: string;
  modified_at: string;
  tags: Tag[];
  average_rating: number;
  number_of_votes: number;
  related_hotels: any[];
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Destination[];
}

export interface FavoriteStatusResponse {
  is_favorite: boolean;
}

export interface DestinationCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  modified_at: string;
  number_of_destinations: number;
}
