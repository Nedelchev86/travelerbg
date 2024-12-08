import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  Destination,
  DestinationCategory,
  FavoriteStatusResponse,
} from '../destination/destination-interface';
import { UserDetails } from '../user-interface';
import { Comment } from '../hotel/hotel-interface';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}`;

  fetchDestinations(
    page: number,
    searchQuery?: string,
    categoryQuery?: string
  ): Observable<ApiResponse> {
    let params = new HttpParams().set('page', page.toString());
    if (searchQuery) {
      params = params.set('title', searchQuery);
    }
    if (categoryQuery) {
      params = params.set('category', categoryQuery);
    }

    return this.http.get<ApiResponse>(`${this.API_URL}destinations/`, {
      params,
    });
  }

  fetchDestinationDetails(destinationId: number): Observable<Destination> {
    return this.http.get<Destination>(
      `${this.API_URL}destinations/${destinationId}/`
    );
  }

  myDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.API_URL}destinations/my/`);
  }

  rateDestination(destinationId: number, rating: number): Observable<any> {
    return this.http.post(
      `${this.API_URL}destinations/${destinationId}/rate/`,
      {
        rating,
      }
    );
  }
  checkIsFavorite(destinationId: number): Observable<FavoriteStatusResponse> {
    return this.http.get<FavoriteStatusResponse>(
      `${this.API_URL}destinations/${destinationId}/is_favorite/`
    );
  }

  addToFavorites(destinationId: number): Observable<any> {
    return this.http.post(
      `${this.API_URL}destinations/${destinationId}/add_to_favorites/`,
      {}
    );
  }

  removeFromFavorites(destinationId: number): Observable<any> {
    return this.http.delete(
      `${this.API_URL}destinations/${destinationId}/remove_from_favorites/`
    );
  }

  updateDestinationRating(destinationId: number): Observable<Destination> {
    return this.http.get<Destination>(
      `${this.API_URL}destinations/${destinationId}`
    );
  }

  fetchAuthorDetails(userId: number): Observable<any> {
    return this.http.get<UserDetails>(`${this.API_URL}travelers/${userId}`);
  }

  fetchCategories(): Observable<any> {
    return this.http.get(`${this.API_URL}categories/`);
  }

  addDestination(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}destinations/`, formData);
  }

  updateDestination(
    formData: FormData,
    destinationId: number
  ): Observable<any> {
    return this.http.put(
      `${this.API_URL}destinations/${destinationId}/`,
      formData
    );
  }

  deleteDestination(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}destinations/${id}/`);
  }

  topDestinations(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.API_URL}destinations/top-rated/`);
  }

  getCategories(): Observable<DestinationCategory> {
    return this.http.get<DestinationCategory>(`${this.API_URL}categories/`);
  }

  fetchUserDestinations(userId: number): Observable<Destination[]> {
    return this.http.get<Destination[]>(
      `${this.API_URL}destinations/by_user/${userId}/`
    );
  }


  
  addComment(destinationId: number, comment: any): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.API_URL}destinations/${destinationId}/comments/add/`,
      comment
    );
  }

  addRegisteredComment(destinationId: number, comment: any): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.API_URL}destinations/${destinationId}/comments/add/`,
      comment
    );
  }

  fetchComments(destinationId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.API_URL}destinations/${destinationId}/comments/`
    );
  }
}
