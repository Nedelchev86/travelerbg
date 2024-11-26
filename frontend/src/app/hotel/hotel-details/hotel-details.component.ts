import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { GoogleMap } from '@angular/google-maps';
import { RatingComponent } from '../../rating/rating.component';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth.service';
import { GalleryLightboxComponent } from '../../shared/components/gallery-lightbox/gallery-lightbox.component';
import { GoogleMapComponent } from '../../shared/components/google-map/google-map.component';

interface Images {
  imageSrc: string;
  imageAlt?: string;
}

interface FavoriteStatusResponse {
  is_favorite: boolean;
}
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
  imports: [
    ReactiveFormsModule,
    RatingComponent,
    CommonModule,
    GoogleMapComponent,
    GalleryLightboxComponent,
  ],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.css',
})
export class HotelDetailsComponent implements OnInit {
  hotel: any = {}; // Store hotel data
  hotelId: string | null = null;
  comments: any[] = []; // Store comments data
  commentForm: FormGroup;
  commentFormRegistred: FormGroup;
  galleryData: Images[] = [];
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private toast = inject(ToastrService);
  isFavorite: boolean = false;

  constructor() {
    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      text: ['', Validators.required],
    });

    this.commentFormRegistred = this.fb.group({
      text: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId');
    if (this.hotelId) {
      this.fetchHotelDetails(this.hotelId);
      this.fetcComments(this.hotelId);
    }
  }

  getFilteredImages(): Images[] {
    return [
      { imageSrc: this.hotel.image2 },
      { imageSrc: this.hotel.image3 },
      { imageSrc: this.hotel.image4 },
    ].filter((item) => item.imageSrc);
  }

  fetchHotelDetails(hotelId: string): void {
    this.http.get<Comment[]>(`${this.API_URL}hotels/${hotelId}/`).subscribe(
      (response: Comment[]) => {
        this.hotel = response;
        this.galleryData = this.getFilteredImages();
        this.checkIsFavorite(hotelId);
      },
      (error) => {
        console.error('Error fetching hotel details:', error);
      }
    );
  }

  fetcComments(hotelId: string): void {
    this.http.get(`${this.API_URL}hotels/${hotelId}/comments/`).subscribe(
      (response: any) => {
        this.comments = response;
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
          `${this.API_URL}hotels/${this.hotelId}/comments/add/`,
          commentData
        )
        .subscribe(
          (response) => {
            this.comments.push(response); // Add the new comment to the list
            this.commentForm.reset();
          },
          (error) => {
            console.error('Error posting comment:', error);
          }
        );
    } else {
      this.commentForm.markAllAsTouched();
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
          `${this.API_URL}hotels/${this.hotelId}/comments/add/`,
          commentData
        )
        .subscribe(
          (response) => {
            this.comments.push(response); // Add the new comment to the list
            this.commentFormRegistred.reset();
          },
          (error) => {
            console.error('Error posting comment:', error);
          }
        );
    } else {
      this.commentFormRegistred.markAllAsTouched();
    }
  }

  rateTHotel(rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate travelers', 'Login required');
      return;
    }

    this.http
      .post(`${this.API_URL}hotels/${this.hotelId}/rate/`, {
        rating,
      })
      .subscribe({
        next: (response) => {
          this.updateTravelerRating(rating);
          this.toast.success('Rating submitted successfully');
        },
        error: (err) => {
            this.toast.error(
              'Please login to rate travelers',
              'Login required'
            );
        },
      });
  }
  updateTravelerRating(rating: number): void {
    {
      this.http.get(`${this.API_URL}hotels/${this.hotelId}`).subscribe({
        next: (data: any) => {
          this.hotel.average_rating = data.average_rating;
          this.hotel.number_of_votes = data.number_of_votes;
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

  checkIsFavorite(hotelId: string): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.http
      .get<FavoriteStatusResponse>(
        `${this.API_URL}hotels/${hotelId}/is_favorite/`
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

  addToFavorites(hotelId: string): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to add to favorites', 'Login required');
      return;
    }
    this.http
      .post(`${this.API_URL}hotels/${hotelId}/add_to_favorites/`, {})
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
  removeFromFavorites(hotelId: string): void {
    this.http
      .post(`${this.API_URL}hotels/${hotelId}/remove_from_favorites/`, {})
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
