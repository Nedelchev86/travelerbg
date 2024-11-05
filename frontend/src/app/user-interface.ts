export interface UserInterface {
  user_type: string;
  user: UserDetails | BussinessDetails;
  email: string;
}

export interface UserDetails {
  user: number;
  name: string;
  description: string;
  location: string;
  phone: string | null;
  address: string;
  email: string;
  image: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  employees: number;
  foundation_year: number;
  activated: boolean;
  first_name: string;
  last_name: string;
  profile_picture: string;
  cover: string;
}

export interface BussinessDetails {
  user: number;
  name: string;
  description: string;
  location: string;
  phone: string | null;
  address: string;
  email: string;
  image: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  employees: number;
  foundation_year: number;
  activated: boolean;
  first_name: string;
  last_name: string;
  profile_picture: string;
  cover: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}
