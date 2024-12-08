import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfileData(): Observable<any> {
    return this.http.get(`${this.API_URL}user/`);
  }

  updateProfileData(formData: FormData, userId: number): Observable<any> {
    return this.http.put(`${this.API_URL}business/${userId}/`, formData);
  }
}
