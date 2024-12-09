import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { AuthService } from '../../services/auth.service';
import { DestinationsByUserComponent } from '../../destination/destinations-by-user/destinations-by-user.component';
import { Traveler } from '../traveler-interface';
import { TravelerService } from '../../services/traveler.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-travelers-details',
  standalone: true,
  imports: [RatingComponent, DestinationsByUserComponent, LoaderComponent],
  templateUrl: './travelers-details.component.html',
  styleUrl: './travelers-details.component.css',
})
export class TravelersDetailsComponent implements OnInit, OnDestroy {
  @Input() travelerId!: number;
  private unsubscribe$ = new Subject<void>();
  public travelerDetails: Traveler = {} as Traveler;
  public loading = false;

  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private travelerDetailsService: TravelerService
  ) {}

  ngOnInit() {
    this.fetchTravelerDetails();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchTravelerDetails(): void {
    this.loading = true;
    this.travelerDetailsService
      .getTraveler(this.travelerId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: Traveler) => {
          this.travelerDetails = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to fetch traveler details', error);
          this.loading = false;
        },
      });
  }

  rateTraveler(travelerId: number, rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate travelers', 'Login required');
      return;
    }

    this.travelerDetailsService.rateTraveler(travelerId, rating).subscribe({
      next: () => {
        this.toast.success('Rating submitted successfully');
      },
      error: (err) => {
        this.toast.error('Failed to submit rating');
      },
    });
  }
  updateTravelerRating(travelerId: number, rating: number): void {
    {
      this.travelerDetailsService.getTraveler(travelerId).subscribe({
        next: (data: any) => {
          this.travelerDetails.average_rating = data.average_rating;
          this.travelerDetails.number_of_votes = data.number_of_votes;
        },
        error: (err) => {
          this.toast.error(
            'Error fetching travelers data',
            'Cannot connect to server'
          );
        },
      });
    }
  }
}
