import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../shared/components/loader/loader.component';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [RouterLink, LoaderComponent],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css',
})
export class BookmarksComponent implements OnInit {
  http = inject(HttpClient);
  authService = inject(AuthService);

  private readonly apiUrl = environment.apiUrl;

  favorites_destinations: any[] = [];
  favorites_hotels: any[] = [];
  favorites_activities: any[] = [];
  loading = true; // Track loading state
  error: string | null = null;

  ngOnInit() {
    const userId: number = this.authService.currentUser().user.user;
    console.log(userId);
    if (userId) {
      this.fetchFavorites(userId);
    }
  }

  fetchFavorites(userId: number): void {
    this.loading = true;

    this.http.get(`${this.apiUrl}travelers/${userId}/favorites/`).subscribe({
      next: (response: any) => {
        this.favorites_destinations = response.favorite_destinations;
        this.favorites_hotels = response.favorite_hotels;
        this.favorites_activities = response.favorite_activities;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to load favorites.';
        this.loading = false;
      },
    });
  }

  removeFavorite(type: string, id: number): void {
    this.http
      .delete(`${this.apiUrl}${type}/${id}/remove_from_favorites/`)
      .subscribe({
        next: () => {
          if (type === 'destinations') {
            this.favorites_destinations = this.favorites_destinations.filter(
              (destination) => destination.id !== id
            );
          } else if (type === 'hotels') {
            this.favorites_hotels = this.favorites_hotels.filter(
              (hotel) => hotel.id !== id
            );
          } else if (type === 'activities') {
            this.favorites_activities = this.favorites_activities.filter(
              (activity) => activity.id !== id
            );
          }
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Failed to remove favorite.';
        },
      });
  }
}
