import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Comment,
  FavoriteStatusResponse,
  Highlights,
  Hotel,
  HotelsCategory,
  HotelsResponse,
} from '../hotel/hotel-interface';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchHotels(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      httpParams = httpParams.set(key, params[key]);
    });
    return this.http.get(`${this.API_URL}hotels/`, { params: httpParams });
  }

  getHotel(hotelId: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.API_URL}hotels/${hotelId}/`);
  }

  rateHotel(hotelId: number, rating: number): Observable<any> {
    return this.http.post(`${this.API_URL}hotels/${hotelId}/rate/`, { rating });
  }

  fetchHotelCategories(): Observable<HotelsCategory[]> {
    return this.http.get<HotelsCategory[]>(`${this.API_URL}categories/hotels/`);
  }

  getHotelDetails(hotelId: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.API_URL}hotels/${hotelId}/`);
  }

  getFavoriteStatus(hotelId: number): Observable<FavoriteStatusResponse> {
    return this.http.get<FavoriteStatusResponse>(
      `${this.API_URL}hotels/${hotelId}/is_favorite/`
    );
  }

  addComment(hotelId: number, comment: any): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.API_URL}hotels/${hotelId}/comments/add/`,
      comment
    );
  }

  addRegisteredComment(hotelId: number, comment: any): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.API_URL}hotels/${hotelId}/comments/add/`,
      comment
    );
  }

  fetchComments(hotelId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.API_URL}hotels/${hotelId}/comments/`
    );
  }

  addToFavorites(hotelId: number): Observable<any> {
    return this.http.post(
      `${this.API_URL}hotels/${hotelId}/add_to_favorites/`,
      {}
    );
  }

  removeFromFavorites(hotelId: number): Observable<any> {
    return this.http.delete(
      `${this.API_URL}hotels/${hotelId}/remove_from_favorites/`
    );
  }

  fetchTopRatedHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.API_URL}hotels/top-rated/`);
  }

  deleteHotel(hotelId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}hotels/${hotelId}/`);
  }

  fetchMyHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.API_URL}hotels/my/`);
  }

  fetchHighlights(): Observable<Highlights[]> {
    return this.http.get<Highlights[]>(`${this.API_URL}highlights/`);
  }

  submitHotelForm(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}hotels/`, formData);
  }

  updateHotelForm(formData: FormData, hotelId: number): Observable<any> {
    return this.http.put(`${this.API_URL}hotels/${hotelId}/`, formData);
  }
}
