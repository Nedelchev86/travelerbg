import { Component, Input, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { AuthService } from '../../services/auth.service';
import { DestinationsByUserComponent } from '../../destination/destinations-by-user/destinations-by-user.component';
import { Traveler } from '../traveler-interface';
import { TravelerService } from '../../services/traveler.service';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-travelers-details',
  standalone: true,
  imports: [RatingComponent, DestinationsByUserComponent, LoaderComponent],
  templateUrl: './travelers-details.component.html',
  styleUrl: './travelers-details.component.css',
})
export class TravelersDetailsComponent implements OnInit {
  @Input() travelerId!: number;

  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private travelerDetailsService: TravelerService
  ) {}

  public travelerDetails: Traveler = {} as Traveler;
  public loading = true;

  ngOnInit() {
    this.fetchTravelerDetails();
    // this.http.get(`${this.API_URL}travelers/${this.travelerId}/`).subscribe(
    //   (data: any) => {
    //     this.travelerDetails = data;
    //   },
    //   (error) => {
    //     console.error('Failed to fetch traveler details', error);
    //   }
    // );
  }

  fetchTravelerDetails(): void {
    this.travelerDetailsService.getTraveler(this.travelerId).subscribe({
      next: (data: Traveler) => {
        this.travelerDetails = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch traveler details', error);
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
