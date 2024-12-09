import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tralevers',
  standalone: true,
  imports: [RouterLink, LoaderComponent, RatingComponent],
  templateUrl: './travelers.component.html',
  styleUrl: './travelers.component.css',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [style({ opacity: 0 })], { optional: true }),

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
export class TraleversComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public data: Traveler[] = [];
  public loading = false;

  constructor(
    private travelerService: TravelerService,
    private toast: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fetchTravelers();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchTravelers(): void {
    this.loading = true;
    this.travelerService
      .fetchTravelers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
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
}
