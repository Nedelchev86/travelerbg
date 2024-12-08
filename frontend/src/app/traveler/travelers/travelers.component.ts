import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TravelerService } from '../../services/traveler.service';
import { Traveler } from '../traveler-interface';

@Component({
  selector: 'app-tralevers',
  standalone: true,
  imports: [RouterLink, LoaderComponent, RatingComponent],
  templateUrl: './travelers.component.html',
  styleUrl: './travelers.component.css',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        // Initial state for the elements
        query(':enter', [style({ opacity: 0 })], { optional: true }),
        // Stagger the elements with an animation
        query(
          ':enter',
          [
            stagger('400ms', [
              animate('1000ms ease-out', style({ opacity: 1 })),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class TraleversComponent {
  public data: Traveler[] = [];
  public loading = true;

  constructor(
    private travelerService: TravelerService,
    private toast: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchTravelers();
    // this.httpClient.get(`${this.API_URL}travelers/`).subscribe({
    //   next: (data: any) => {
    //     this.data = data;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     this.toast.error(
    //       'Error fetching travelers data',
    //       'Cannot connect to server'
    //     );
    //   },
    // });
  }

  fetchTravelers(): void {
    this.travelerService.fetchTravelers().subscribe({
      next: (data: Traveler[]) => {
        this.data = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch travelers', error);
        this.toast.error('Failed to fetch travelers');
        this.loading = false;
      },
    });
  }

  rateTraveler(travelerId: number, rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate travelers', 'Login required');
      return;
    }

    this.travelerService.rateTraveler(travelerId, rating).subscribe({
      next: () => {
        this.updateTravelerRating(travelerId, rating);
        this.toast.success('Rating submitted successfully');
      },
      error: (err) => {
        this.toast.error('Failed to submit rating');
      },
    });
  }

  updateTravelerRating(travelerId: number, rating: number): void {
    const traveler = this.data.find((t) => t.user === travelerId);
    if (traveler) {
      this.travelerService.getTraveler(travelerId).subscribe({
        next: (data: Traveler) => {
          traveler.average_rating = data.average_rating;
          traveler.number_of_votes = data.number_of_votes;
        },
        error: (err) => {
          console.error('Failed to update traveler rating', err);
        },
      });
    }
  }

  // rateTraveler(travelerId: string, rating: number): void {
  //   if (!this.authService.isLoggedIn()) {
  //     this.toast.error('Please login to rate travelers', 'Login required');
  //     return;
  //   }

  //   this.httpClient
  //     .post(`${this.API_URL}travelers/${travelerId}/rate/`, {
  //       rating,
  //     })
  //     .subscribe({
  //       next: (response) => {
  //         this.updateTravelerRating(travelerId, rating);
  //         this.toast.success('Rating submitted successfully');
  //       },
  //       error: (err) => {
  //         this.toast.error('Please login to rate travelers', 'Login required');
  //       },
  //     });
  // }
  // updateTravelerRating(travelerId: string, rating: number): void {
  //   const traveler = this.data.find((t) => t.user === travelerId);
  //   if (traveler) {
  //     this.httpClient.get(`${this.API_URL}travelers/${travelerId}`).subscribe({
  //       next: (data: any) => {
  //         traveler.average_rating = data.average_rating;
  //         traveler.number_of_votes = data.number_of_votes;
  //       },
  //       error: (err) => {
  //         this.toast.error(
  //           'Error fetching travelers data',
  //           'Cannot connect to server'
  //         );
  //       },
  //     });
  //   }
  // }
}
