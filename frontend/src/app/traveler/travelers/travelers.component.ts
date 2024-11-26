import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { RouterLink } from '@angular/router';
import { ShapeMockupDirective } from '../../directives/shape-mockup.directive';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { RatingComponent } from '../../rating/rating.component';
import { TopDestinationComponent } from '../../top-destination/top-destination.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tralevers',
  standalone: true,
  imports: [RouterLink, LoaderComponent, RatingComponent],
  templateUrl: './travelers.component.html',
  styleUrl: './travelers.component.css',
})
export class TraleversComponent {
  httpClient = inject(HttpClient);
  public data: Array<any> = [];
  loading = true;
  toast = inject(ToastrService);
  authService = inject(AuthService);
  private readonly API_URL = environment.apiUrl;

  ngOnInit() {
    this.httpClient.get(`${this.API_URL}travelers/`).subscribe({
      next: (data: any) => {
        this.data = data;
        this.loading = false;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
        this.toast.error(
          'Error fetching travelers data',
          'Cannot connect to server'
        );
      },
    });
  }

  rateTraveler(travelerId: string, rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate travelers', 'Login required');
      return;
    }

    this.httpClient
      .post(`${this.API_URL}travelers/${travelerId}/rate/`, {
        rating,
      })
      .subscribe({
        next: (response) => {
          console.log('Rating submitted successfully', response);
          this.updateTravelerRating(travelerId, rating);
          this.toast.success('Rating submitted successfully');
        },
        error: (err) => {
          console.log('Failed to submit rating', err),
            this.toast.error(
              'Please login to rate travelers',
              'Login required'
            );
        },
      });
  }
  updateTravelerRating(travelerId: string, rating: number): void {
    const traveler = this.data.find((t) => t.user === travelerId);
    if (traveler) {
      this.httpClient.get(`${this.API_URL}travelers/${travelerId}`).subscribe({
        next: (data: any) => {
          traveler.average_rating = data.average_rating;
          traveler.number_of_votes = data.number_of_votes;
        },
        error: (err) => {
          console.log(err);
          this.toast.error(
            'Error fetching travelers data',
            'Cannot connect to server'
          );
        },
      });
    }
  }
}
