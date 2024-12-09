export interface Activity {
  id: number;
  user: number;
  title: string;
  highlight: string;
  category: number;
  description: string;
  location: string;
  duration: number;
  lat: string;
  lng: string;
  image: string;
  image2: string;
  image3: string;
  price: string;
  tags: Tag[];
  created_at: string;
  modified_at: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface ActivityCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  modified_at: string;
  number_of_hotels: number;
}
