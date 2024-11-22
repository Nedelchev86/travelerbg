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
  httpClient = inject(HttpClient);
  geocoder = inject(MapGeocoder);
  private route = inject(ActivatedRoute);
  public data: any = {};
  public categoryQuery: string = '';
  public newDestination: string = '';
  public traveler: any = {};

  ngOnInit() {
    this.destinationId = this.route.snapshot.paramMap.get('destinationId');

    if (this.destinationId) {
      this.fetchHotelDetails(this.destinationId);
    }
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
    this.httpClient
      .get(`http://localhost:8000/api/destinations/${destinationId}/`)
      .subscribe({
        next: (data: any) => {
          this.data = data;
          this.galleryData = this.getFilteredImages();
          this.geocodeAddress(this.data.location);
          this.getUserDetails(data.user);
        },
        error: (err) => console.log(err),
      });
  }

  getUserDetails(travelerId: number): void {
    this.httpClient
      .get(`http://localhost:8000/api/travelers/${travelerId}`)
      .subscribe({
        next: (data: any) => {
          this.traveler = data;
          console.log('Traveler data:', data);
        },
        error: (err) => console.log('Failed to fetch user data', err),
      });
  }

  geocodeAddress(address: string): void {
    this.geocoder.geocode({ address }).subscribe(({ results }) => {
      if (results.length > 0) {
        const location = results[0].geometry.location;
        this.center = { lat: location.lat(), lng: location.lng() };
        this.markerPosition = { lat: location.lat(), lng: location.lng() };
      }
    });
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
}
