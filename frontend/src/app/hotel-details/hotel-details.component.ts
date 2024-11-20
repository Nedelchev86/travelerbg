import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShapeMockupDirective } from '../shape-mockup.directive';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { RatingComponent } from '../rating/rating.component';
import { CommonModule } from '@angular/common';

export interface Comment {
  created_at: String;
  email: String;
  hotel: Number;
  id: Number;
  modified_at: String;
  name: String;
  text: String;
  user: null | String;
}

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [ReactiveFormsModule, RatingComponent, CommonModule],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.css',
})
export class HotelDetailsComponent {
  hotel: any = {}; // Store hotel data
  hotelId: string | null = null;
  comments: any[] = []; // Store comments data
  commentForm: FormGroup;
  commentFormRegistred: FormGroup;

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private toast = inject(ToastrService);

  constructor() {
    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      text: ['', Validators.required],
      saveInfo: [false],
    });

    this.commentFormRegistred = this.fb.group({
      text: ['', Validators.required],
      saveInfo: [false],
    });
  }

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId');
    if (this.hotelId) {
      this.fetchHotelDetails(this.hotelId);
      this.fetcComments(this.hotelId);
    }
  }

  fetchHotelDetails(hotelId: string): void {
    this.http
      .get<Comment[]>(`http://127.0.0.1:8000/api/hotels/${hotelId}/`)
      .subscribe(
        (response: Comment[]) => {
          this.hotel = response;
          console.log(this.hotel);
        },
        (error) => {
          console.error('Error fetching hotel details:', error);
        }
      );
  }

  fetcComments(hotelId: string): void {
    this.http
      .get(`http://127.0.0.1:8000/api/hotels/${hotelId}/comments/`)
      .subscribe(
        (response: any) => {
          this.comments = response;
          console.log(this.comments);
        },
        (error) => {
          console.error('Error fetching comments details:', error);
        }
      );
  }

  onSubmitComment(): void {
    if (this.commentForm.valid) {
      const commentData = {
        ...this.commentForm.value,
        hotel: this.hotelId,
      };
      this.http
        .post(
          `http://127.0.0.1:8000/api/hotels/${this.hotelId}/comments/add/`,
          commentData
        )
        .subscribe(
          (response) => {
            console.log('Comment posted successfully', response);
            this.comments.push(response); // Add the new comment to the list
            this.commentForm.reset();
          },
          (error) => {
            console.error('Error posting comment:', error);
          }
        );
    }
  }

  onSubmitRegistredComment(): void {
    if (this.commentFormRegistred.valid) {
      const commentData = {
        ...this.commentFormRegistred.value,
        hotel: this.hotelId,
      };
      this.http
        .post(
          `http://127.0.0.1:8000/api/hotels/${this.hotelId}/comments/add/`,
          commentData
        )
        .subscribe(
          (response) => {
            console.log('Comment posted successfully', response);
            this.comments.push(response); // Add the new comment to the list
            this.commentFormRegistred.reset();
          },
          (error) => {
            console.error('Error posting comment:', error);
          }
        );
    }
  }

  rateTHotel(rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate travelers', 'Login required');
      return;
    }

    this.http
      .post(`http://localhost:8000/api/hotels/${this.hotelId}/rate/`, {
        rating,
      })
      .subscribe({
        next: (response) => {
          console.log('Rating submitted successfully', response);
          this.updateTravelerRating(rating);
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
  updateTravelerRating(rating: number): void {
    {
      this.http
        .get(`http://localhost:8000/api/hotels/${this.hotelId}`)
        .subscribe({
          next: (data: any) => {
            this.hotel.average_rating = data.average_rating;
            this.hotel.number_of_votes = data.number_of_votes;
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
  }
}
