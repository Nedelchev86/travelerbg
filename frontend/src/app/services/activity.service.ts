import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Activity,
  ActivityCategory,
} from '../activity/activities/activity-iterface';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchActivities(params: any): Observable<Activity[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<Activity[]>(`${this.API_URL}activities/`, {
      params: httpParams,
    });
  }

  fetchCategories(): Observable<ActivityCategory[]> {
    return this.http.get<ActivityCategory[]>(
      `${this.API_URL}categories/activities/`
    );
  }

  fetchMyActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.API_URL}activities/my/`);
  }

  deleteActivity(activityId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}activities/${activityId}/`);
  }

  submitActivityForm(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}activities/`, formData);
  }

  getActivityDetails(activityId: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.API_URL}activities/${activityId}/`);
  }

  checkIsFavorite(activityId: number): Observable<any> {
    return this.http.get(
      `${this.API_URL}activities/${activityId}/is_favorite/`
    );
  }

  addToFavorites(activityId: number): Observable<any> {
    return this.http.post(`${this.API_URL}activities/${activityId}/add_to_favorites/`, {});
  }

  removeFromFavorites(activityId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}activities/${activityId}/remove_from_favorites/`);
  }
}
