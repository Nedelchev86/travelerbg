import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RatingComponent } from '../rating/rating.component';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { DestinationsByUserComponent } from '../destinations-by-user/destinations-by-user.component';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-travelers-details',
  standalone: true,
  imports: [RatingComponent, DestinationsByUserComponent],
  templateUrl: './travelers-details.component.html',
  styleUrl: './travelers-details.component.css',
})
export class TravelersDetailsComponent implements OnInit {
  @Input() travelerId!: string;
  http = inject(HttpClient);
  travelerDetails: any;
  authService = inject(AuthService);
  toast = inject(ToastrService);
  private readonly API_URL = environment.apiUrl;

  ngOnInit() {
    console.log('Traveler ID:', this.travelerId);
    this.http.get(`${this.API_URL}travelers/${this.travelerId}/`).subscribe(
      (data: any) => {
        this.travelerDetails = data;
      },
      (error) => {
        console.error('Failed to fetch traveler details', error);
      }
    );
  }
  rateTraveler(travelerId: string, rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate travelers', 'Login required');
      return;
    }

    this.http
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
    {
      this.http.get(`${this.API_URL}travelers/${travelerId}`).subscribe({
        next: (data: any) => {
          this.travelerDetails.average_rating = data.average_rating;
          this.travelerDetails.users_rated = data.users_rated;
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
