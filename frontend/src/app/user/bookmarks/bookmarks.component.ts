import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [RouterLink, LoaderComponent],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css',
})
export class BookmarksComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  public favorites_destinations: any[] = [];
  public favorites_hotels: any[] = [];
  public favorites_activities: any[] = [];
  public loading = true; // Track loading state
  public error: string | null = null;

  constructor(private authService: AuthService, private toast: ToastrService) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      let userType: string;
      if (user.user_type === 'traveler') {
        userType = 'travelers';
      } else {
        userType = 'business';
      }
      const userId = user.user.user;
      this.fetchFavorites(userId, userType);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchFavorites(userId: number, userType: string): void {
    this.loading = true;

    this.authService.getBookmarks(userType, userId).pipe(takeUntil(this.unsubscribe$)).subscribe({
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

  removeFavorite(type: string, id: number, name: string): void {
    this.authService.removeFavorite(type, id).subscribe({
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
        this.toast.success(`${name} removed.`);
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Failed to remove favorite.';
      },
    });
  }
}
