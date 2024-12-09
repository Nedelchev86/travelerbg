import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { AuthService } from '../../services/auth.service';
import { GalleryLightboxComponent } from '../../shared/components/gallery-lightbox/gallery-lightbox.component';
import { GoogleMapComponent } from '../../shared/components/google-map/google-map.component';
import { HotelService } from '../../services/hotel.service';
import { Comment, FavoriteStatusResponse, Hotel } from '../hotel-interface';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { HotelCommentsComponent } from '../hotel-comments/hotel-comments.component';
import { Subject, takeUntil } from 'rxjs';
interface Images {
  imageSrc: string;
  imageAlt?: string;
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
    LoaderComponent,
    HotelCommentsComponent,
  ],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1500ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-20px)' }),
            stagger('100ms', [
              animate(
                '500ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class HotelDetailsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public loading: boolean = true;
  public hotel: Hotel = {} as Hotel; // Store hotel data
  public hotelId: number | null = null;
  public galleryData: Images[] = [];
  public isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private toast: ToastrService,
    private hotelDetailsService: HotelService
  ) {}

  ngOnInit(): void {
    this.hotelId = Number(this.route.snapshot.paramMap.get('hotelId'));
    if (this.hotelId) {
      this.fetchFavoriteStatus();
      // this.fetchComments();
      this.fetchHotelDetails();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getFilteredImages(): Images[] {
    return [
      { imageSrc: this.hotel.image2 },
      { imageSrc: this.hotel.image3 },
      { imageSrc: this.hotel.image4 },
    ].filter((item) => item.imageSrc);
  }

  fetchHotelDetails(): void {
    this.hotelDetailsService
      .getHotelDetails(this.hotelId!)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: Hotel) => {
          this.hotel = data;
          this.galleryData = this.getFilteredImages();
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch hotel details', err);
          this.toast.error('Failed to fetch hotel details');
        },
      });
  }

  fetchFavoriteStatus(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.hotelDetailsService
      .getFavoriteStatus(this.hotelId!)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: FavoriteStatusResponse) => {
          this.isFavorite = data.is_favorite;
        },
        error: (err) => {
          console.error('Failed to fetch favorite status', err);
          this.toast.error('Failed to fetch favorite status');
        },
      });
  }

  rateHotel(rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate hotel', 'Login required');
      return;
    }

    this.hotelDetailsService.rateHotel(this.hotelId!, rating).subscribe({
      next: () => {
        this.toast.success('Rating submitted successfully');
        this.updateTravelerRating(rating);
      },
      error: (err) => {
        this.toast.error('Failed to submit rating');
      },
    });
  }

  updateTravelerRating(rating: number): void {
    {
      this.hotelDetailsService.getHotelDetails(this.hotelId!).subscribe({
        next: (data: Hotel) => {
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

  addToFavorites(hotelId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to add to favorites', 'Login required');
      return;
    }
    this.hotelDetailsService.addToFavorites(hotelId).subscribe({
      next: () => {
        this.isFavorite = true; // Set favorite status to true
        this.toast.success('Added to favorites successfully');
      },
      error: (err) => {
        console.error('Failed to add to favorites', err);
        this.toast.error('Failed to add to favorites');
      },
    });
  }

  removeFromFavorites(hotelId: number): void {
    this.hotelDetailsService.removeFromFavorites(hotelId).subscribe({
      next: () => {
        this.isFavorite = false; // Set favorite status to false
        this.toast.success('Removed from favorites successfully');
      },
      error: (err) => {
        console.error('Failed to remove from favorites', err);
        this.toast.error('Failed to remove from favorites');
      },
    });
  }
}
