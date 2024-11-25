import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  GoogleMap,
  MapAdvancedMarker,
  MapGeocoder,
} from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Rotate } from '@cloudinary/url-gen/actions';
import { ShapeMockupDirective } from '../shape-mockup.directive';
import { GoogleMapComponent } from '../google-map/google-map.component';
import { DestinationCommentsComponent } from '../destination-comments/destination-comments.component';
import { GalleryLightboxComponent } from '../gallery-lightbox/gallery-lightbox.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { RatingComponent } from '../rating/rating.component';
import { environment } from '../../environments/environment';

interface Images {
  imageSrc: string;
  imageAlt?: string;
}

interface FavoriteStatusResponse {
  is_favorite: boolean;
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
  ],
  templateUrl: './destination-details.component.html',
  styleUrl: './destination-details.component.css',
})
export class DestinationDetailsComponent implements OnInit {
  destinationId: string | null = null;
  galleryData: Images[] = [];
  center: google.maps.LatLngLiteral = { lat: 42.504792, lng: 27.462636 };
  zoom = 15;
  markerPosition: google.maps.LatLngLiteral = {
    lat: 42.504792,
    lng: 27.462636,
  };
  mapOptions: google.maps.MapOptions = {
    mapId: '453204c6eedd332f',
    gestureHandling: 'greedy',
  };
  http = inject(HttpClient);
  geocoder = inject(MapGeocoder);
  toast = inject(ToastrService);
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  public data: any = {};
  public categoryQuery: string = '';
  public newDestination: string = '';
  public traveler: any = {};
  private readonly API_URL = environment.apiUrl;
  isFavorite: boolean = false;

  ngOnInit() {
    // this.destinationId = this.route.snapshot.paramMap.get('destinationId');

    // if (this.destinationId) {
    //   this.fetchHotelDetails(this.destinationId);
    // }
    this.route.params.subscribe((params) => {
      this.destinationId = params['destinationId'];
      if (this.destinationId) {
        this.fetchHotelDetails(this.destinationId);
      }
    });
  }

  getFilteredImages(): Images[] {
    return [
      { imageSrc: this.data.image1 },
      { imageSrc: this.data.image2 },
      { imageSrc: this.data.image3 },
      { imageSrc: this.data.image4 },
    ].filter((item) => item.imageSrc);
  }

  fetchHotelDetails(destinationId: string): void {
    const params = {
      category: this.categoryQuery,
    };
    this.http.get(`${this.API_URL}destinations/${destinationId}/`).subscribe({
      next: (data: any) => {
        this.data = data;
        this.galleryData = this.getFilteredImages();
        this.geocodeAddress(this.data.location);
        this.getUserDetails(data.user);
        this.checkIsFavorite(destinationId);
      },
      error: (err) => console.log(err),
    });
  }

  getUserDetails(travelerId: number): void {
    this.http.get(`${this.API_URL}travelers/${travelerId}`).subscribe({
      next: (data: any) => {
        this.traveler = data;
        console.log('Traveler data:', data);
      },
      error: (err) => console.log('Failed to fetch user data', err),
    });
  }

  geocodeAddress(address: string): void {
    if (this.data.lat && this.data.lng) {
      this.center = { lat: this.data.lat, lng: this.data.lng };
      this.markerPosition = { lat: this.data.lat, lng: this.data.lng };
    } else {
      this.geocoder.geocode({ address }).subscribe(({ results }) => {
        if (results.length > 0) {
          const location = results[0].geometry.location;
          this.center = { lat: location.lat(), lng: location.lng() };
          this.markerPosition = { lat: location.lat(), lng: location.lng() };
        }
      });
    }
  }

  addDestination(): void {
    if (this.newDestination) {
      this.geocodeAddress(this.newDestination);
    }
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      console.log(this.markerPosition);
    }
  }

  rateTHotel(rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate travelers', 'Login required');
      return;
    }

    this.http
      .post(`${this.API_URL}destinations/${this.destinationId}/rate/`, {
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
        .get(`${this.API_URL}destinations/${this.destinationId}`)
        .subscribe({
          next: (data: any) => {
            this.data.average_rating = data.average_rating;
            this.data.number_of_votes = data.number_of_votes;
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
  checkIsFavorite(destinationId: string): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.http
      .get<FavoriteStatusResponse>(
        `${this.API_URL}destinations/${destinationId}/is_favorite/`
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

  addToFavorites(destinationId: string): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to add to favorites', 'Login required');
      return;
    }
    this.http
      .post(
        `${this.API_URL}destinations/${destinationId}/add_to_favorites/`,
        {}
      )
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
  removeFromFavorites(destinationId: string): void {
    this.http
      .post(
        `${this.API_URL}destinations/${destinationId}/remove_from_favorites/`,
        {}
      )
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
