import {
  Component,
  inject,
  Input,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  MapGeocoder,
  MapAdvancedMarker,
  GoogleMap,
} from '@angular/google-maps';
import { SetBgImageDirective } from '../../../directives/set-bg-image.directive';

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [GoogleMap, MapAdvancedMarker, SetBgImageDirective],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.css',
})
export class GoogleMapComponent implements OnChanges {
  @Input() location: string = '';
  @Input() lat: number = 42.504792;
  @Input() lng: number = 27.462636;

  center: google.maps.LatLngLiteral = { lat: this.lat, lng: this.lng };
  zoom = 15;
  markerPosition: google.maps.LatLngLiteral = {
    lat: this.lat,
    lng: this.lng,
  };
  mapOptions: google.maps.MapOptions = {
    mapId: '453204c6eedd332f',
    gestureHandling: 'greedy',
  };

  geocoder = inject(MapGeocoder);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['location'] && changes['location'].currentValue) {
      this.geocodeAddress(this.location);
    }
    if (
      changes['lat'] &&
      changes['lat'].currentValue &&
      changes['lng'] &&
      changes['lng'].currentValue
    ) {
      this.center = { lat: Number(this.lat), lng: Number(this.lng) };
      this.markerPosition = { lat: Number(this.lat), lng: Number(this.lng) };
    }
  }

  geocodeAddress(address: string): void {
    this.geocoder.geocode({ address }).subscribe(({ results }) => {
      if (results.length > 0) {
        const location = results[0].geometry.location;

        this.lat = location.lat();
        this.lng = location.lng();
        this.center = { lat: location.lat(), lng: location.lng() };
        this.markerPosition = { lat: location.lat(), lng: location.lng() };
      }
    });
  }
}
