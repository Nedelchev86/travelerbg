import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Traveler } from '../traveler/traveler-interface';

@Injectable({
  providedIn: 'root',
})
export class TravelerService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchTravelers(): Observable<Traveler[]> {
    return this.http.get<Traveler[]>(`${this.API_URL}travelers/`);
  }

  rateTraveler(travelerId: number, rating: number): Observable<any> {
    return this.http.post(`${this.API_URL}travelers/${travelerId}/rate/`, {
      rating,
    });
  }

  getTraveler(travelerId: number): Observable<Traveler> {
    return this.http.get<Traveler>(`${this.API_URL}travelers/${travelerId}/`);
  }

  fetchTopTravelers(): Observable<Traveler[]> {
    return this.http.get<Traveler[]>(`${this.API_URL}travelers/top-rated/`);
  }

  getProfileData(): Observable<any> {
    return this.http.get(`${this.API_URL}traveler/update/`);
  }

  updateProfileData(formData: FormData): Observable<any> {
    return this.http.put(`${this.API_URL}traveler/update/`, formData);
  }
}
