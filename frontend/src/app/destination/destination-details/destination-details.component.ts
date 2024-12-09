import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MapGeocoder } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { DestinationCommentsComponent } from '../destination-comments/destination-comments.component';
import { GalleryLightboxComponent } from '../../shared/components/gallery-lightbox/gallery-lightbox.component';
import { GoogleMapComponent } from '../../shared/components/google-map/google-map.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { DestinationService } from '../../services/destination.service';
import { UserDetails } from '../../user-interface';
import { Destination } from '../destination-interface';
import { Subject, takeUntil } from 'rxjs';

interface Images {
  imageSrc: string;
  imageAlt?: string;
}

@Component({
  selector: 'app-destination-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapComponent,
    DestinationCommentsComponent,
    GalleryLightboxComponent,
    RouterLink,
    RatingComponent,
    LoaderComponent,
  ],
  templateUrl: './destination-details.component.html',
  styleUrl: './destination-details.component.css',
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '1200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class DestinationDetailsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public data: Destination = {} as Destination;
  public categoryQuery: string = '';
  public newDestination: string = '';
  public traveler: any = {};
  public isFavorite: boolean = false;
  public loading = true;

  constructor(
    private destinationsService: DestinationService,
    private authService: AuthService,
    private toast: ToastrService,
    private route: ActivatedRoute // private geocoder: MapGeocoder
  ) {}

  destinationId: number | null = null;
  galleryData: Images[] = [];
  // center: google.maps.LatLngLiteral = { lat: 42.504792, lng: 27.462636 };
  // zoom = 15;
  // markerPosition: google.maps.LatLngLiteral = {
  //   lat: 42.504792,
  //   lng: 27.462636,
  // };
  // mapOptions: google.maps.MapOptions = {
  //   mapId: '453204c6eedd332f',
  //   gestureHandling: 'greedy',
  // };

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.destinationId = params['destinationId'];
      if (this.destinationId) {
        this.fetchDestinationDetails(this.destinationId);
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getFilteredImages(): Images[] {
    return [
      { imageSrc: this.data.image },
      { imageSrc: this.data.image2 },
      { imageSrc: this.data.image3 },
      { imageSrc: this.data.image4 },
    ].filter((item) => item.imageSrc);
  }

  fetchDestinationDetails(destinationId: number): void {
    this.loading = true;
    this.destinationsService
      .fetchDestinationDetails(destinationId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: Destination) => {
          this.data = data;
          this.galleryData = this.getFilteredImages();
          this.checkIsFavorite(destinationId);
          this.getUserDetails(data.user);
          this.loading = false;
        },
        error: (err) => {
          this.toast.error('Failed to load destination details');
          this.loading = false;
        },
      });
  }

  getUserDetails(travelerId: number): void {
    this.destinationsService
      .fetchAuthorDetails(travelerId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: UserDetails) => {
          this.traveler = data;
          this.loading = false;
        },
        error: (err) => console.log('Failed to fetch user data', err),
      });
  }

  // geocodeAddress(address: string): void {
  //   if (this.data.lat && this.data.lng) {
  //     this.center = { lat: this.data.lat, lng: this.data.lng };
  //     this.markerPosition = { lat: this.data.lat, lng: this.data.lng };
  //   } else {
  //     this.geocoder.geocode({ address }).subscribe(({ results }) => {
  //       if (results.length > 0) {
  //         const location = results[0].geometry.location;
  //         this.center = { lat: location.lat(), lng: location.lng() };
  //         this.markerPosition = { lat: location.lat(), lng: location.lng() };
  //       }
  //     });
  //   }
  // }

  rateDestination(rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate destinations', 'Login required');
      return;
    }

    this.destinationsService
      .rateDestination(this.destinationId!, rating)
      .subscribe({
        next: () => {
          this.toast.success('Rating submitted successfully');
          this.updateRating();
        },
        error: () => {
          this.toast.error('Failed to submit rating');
        },
      });
  }

  updateRating(): void {
    this.destinationsService
      .updateDestinationRating(this.destinationId!)
      .subscribe({
        next: (data) => {
          if (this.data) {
            this.data.average_rating = data.average_rating;
            this.data.number_of_votes = data.number_of_votes;
          }
        },
        error: () => {
          this.toast.error('Failed to update rating');
        },
      });
  }

  checkIsFavorite(destinationId: number): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.destinationsService
      .checkIsFavorite(destinationId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.isFavorite = response.is_favorite;
        },
        error: (err) => {
          console.error('Failed to check favorite status', err);
        },
      });
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to modify favorites', 'Login required');
      return;
    }

    const action = this.isFavorite
      ? this.destinationsService.removeFromFavorites(this.destinationId!)
      : this.destinationsService.addToFavorites(this.destinationId!);

    action.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.isFavorite = !this.isFavorite;
        this.toast.success(
          this.isFavorite ? 'Added to favorites' : 'Removed from favorites'
        );
      },
      error: (err) => {
        this.toast.error('Failed to update favorite status');
      },
    });
  }
}
