import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment'; // Import the environment configuration

interface FavoriteStatusResponse {
  is_favorite: boolean;
}

@Component({
  selector: 'app-activitie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activitie-details.component.html',
  styleUrl: './activitie-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActivitieDetailsComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private toast = inject(ToastrService);
  private readonly API_URL = environment.apiUrl;
  isFavorite: boolean = false;
  activitie: any = {}; // Store hotel data
  activitieId: string | null = null;

  ngOnInit(): void {
    this.activitieId = this.route.snapshot.paramMap.get('activitieId');
    if (this.activitieId) {
      this.fetchActivitieDetails(this.activitieId);
    }
  }

  fetchActivitieDetails(activitieId: string): void {
    this.http
      .get<Comment[]>(`${this.API_URL}activities/${activitieId}/`)
      .subscribe(
        (response: Comment[]) => {
          this.activitie = response;
          this.checkIsFavorite(activitieId);
        },
        (error) => {
          console.error('Error fetching activity details:', error);
        }
      );
  }
  checkIsFavorite(activitieId: string): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.http
      .get<FavoriteStatusResponse>(
        `${this.API_URL}activities/${activitieId}/is_favorite/`
      )
      .subscribe({
        next: (response) => {
          this.isFavorite = response?.['is_favorite'] || false;
        },
        error: (err) => {
          console.error('Failed to check favorite status', err);
        },
      });
  }

  addToFavorites(activityId: string): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to add to favorites', 'Login required');
      return;
    }
    this.http
      .post(`${this.API_URL}activities/${activityId}/add_to_favorites/`, {})
      .subscribe({
        next: (response) => {
          this.isFavorite = true; // Set favorite status to true
          this.toast.success('Added to favorites successfully');
        },
        error: (err) => {
          console.error('Failed to add to favorites', err);
          this.toast.error('Failed to add to favorites');
        },
      });
  }
  removeFromFavorites(activityId: string): void {
    this.http
      .delete(`${this.API_URL}activities/${activityId}/remove_from_favorites/`)
      .subscribe({
        next: (response) => {
          this.isFavorite = true; // Set favorite status to true
          this.toast.success('Removed from favorite successfully');
          this.isFavorite = false;
        },
        error: (err) => {
          console.error('Failed to remove from favorites', err);
          this.toast.error('Failed to remove from  favorites');
        },
      });
  }
}
