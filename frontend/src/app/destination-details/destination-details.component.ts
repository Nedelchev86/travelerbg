import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { RouterLink } from '@angular/router';
import {
  GoogleMap,
  MapAdvancedMarker,
  MapGeocoder,
} from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-destination-details',
  standalone: true,
  imports: [
    CommonModule,
    SetBgImageDirective,
    RouterLink,
    GoogleMap,
    MapAdvancedMarker,
    FormsModule,
  ],
  templateUrl: './destination-details.component.html',
  styleUrl: './destination-details.component.css',
})
export class DestinationDetailsComponent implements OnInit {
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
  public data: any = {};
  public categoryQuery: string = '';
  public newDestination: string = '';
  ngOnInit() {
    const params = {
      category: this.categoryQuery,
    };
    this.httpClient
      .get('http://localhost:8000/api/destinations/11/')
      .subscribe({
        next: (data: any) => {
          this.data = data;
          this.geocodeAddress(this.data.location);
        },
        error: (err) => console.log(err),
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
