export interface HotelTag {
  id: number;
  name: string;
}

export interface Highlights {
  id: number;
  name: string;
}

export interface Hotel {
  id: number;
  user: number;
  name: string;
  category: number;
  description: string; // HTML content
  location: string;
  highlights: Highlights[]; // An array of highlights (empty in your data)
  website: string;
  lat: string | null; // Latitude as string or null
  lng: string | null; // Longitude as string or null
  image: string; // URL to the primary image
  image2: string; // URL to the second image
  image3: string; // URL to the third image
  image4: string; // URL to the fourth image (can be empty)
  price: string; // Price as a string
  tags: HotelTag[]; // An array of tags
  created_at: string; // Creation timestamp (ISO format)
  modified_at: string; // Modification timestamp (ISO format)
  average_rating: number; // Average rating
  number_of_votes: number; // Number of votes
}

export interface HotelsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Hotel[]; // An array of hotels
}

export interface HotelsCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  modified_at: string;
  number_of_hotels: number;
}

export interface FavoriteStatusResponse {
  is_favorite: boolean;
}

export interface Comment {
  created_at: string;
  email: string;
  hotel: number;
  id: number;
  modified_at: string;
  name: string;
  text: string;
  user: User;
}

export interface User {
  id: number;
  profile_picture: string;
  image: string;
}

