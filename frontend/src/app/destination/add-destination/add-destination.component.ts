import { CommonModule } from '@angular/common';

import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  MapGeocoder,
  MapAdvancedMarker,
  GoogleMap,
} from '@angular/google-maps';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CKEditorConfigService } from '../../shared/services/ckeditor-config.service';
import { AuthService } from '../../services/auth.service';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';
import { DestinationService } from '../../services/destination.service';
import { minLengthArray } from '../../validators/minLengthArray.validator';
import { DestinationCategory } from '../destination-interface';
import { FormUtilsService } from '../../services/form-utils.service';

@Component({
  selector: 'app-add-destination',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GoogleMap,
    MapAdvancedMarker,
    CKEditorModule,
  ],
  templateUrl: './add-destination.component.html',
  styleUrl: './add-destination.component.css',
})
export class AddDestinationComponent {
  private ckEditorConfigService = inject(CKEditorConfigService);
  public Editor = this.ckEditorConfigService.Editor;
  public config = this.ckEditorConfigService.config;
  public loading: boolean = true;
  addDestinationForm: FormGroup;
  categories: DestinationCategory[] = [];
  tags: FormArray;
  imagePreviews: { [key: string]: string } = {};

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cloudinaryuploadService: CloudinaryuploadService,
    private destinationService: DestinationService,
    private formDataService: FormUtilsService,
    private geocoder: MapGeocoder,
    private authService: AuthService
  ) {
    this.addDestinationForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      image2: [''],
      image3: [''],
      image4: [''],
      image5: [''],
      location: ['', Validators.required],
      time: ['', Validators.required],
      lat: [''], // Add lat control
      lng: [''], // Add lng control
      is_published: [true],
      tags: this.fb.array([], minLengthArray(1)),
      newTag: [''], // Input field for new tag
    });
    this.tags = this.addDestinationForm.get('tags') as FormArray;
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.destinationService.fetchCategories().subscribe({
      next: (categories: DestinationCategory[]) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => console.error('Failed to fetch categories', err),
    });
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.cloudinaryuploadService.uploadImage(file).subscribe(
        (response) => {
          this.addDestinationForm.patchValue({
            [field]: response.secure_url,
          });
          this.imagePreviews[field] = response.secure_url;
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }

  removeImage(field: string): void {
    this.addDestinationForm.patchValue({
      [field]: null,
    });
    delete this.imagePreviews[field];
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.addDestinationForm.patchValue({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  }

  onLocationChange(): void {
    const location = this.addDestinationForm.get('location')?.value;
    if (location) {
      this.geocodeAddress(location);
    }
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

  addNewTag(): void {
    const newTag = this.addDestinationForm.get('newTag')?.value;
    if (newTag) {
      this.addTag(newTag);
      this.addDestinationForm.get('newTag')?.reset();
    }
  }

  addTag(tagName: string = ''): void {
    if (tagName && !this.tags.value.includes(tagName)) {
      this.tags.push(this.fb.control(tagName, Validators.required));
    }
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  onSubmit() {
    if (this.addDestinationForm.invalid) {
      this.addDestinationForm.markAllAsTouched();
      return;
    }
    const formData = this.formDataService.createFormData(
      this.addDestinationForm
    );

    this.destinationService.addDestination(formData).subscribe({
      next: () => {
        this.authService.fetchUserData();
        this.router.navigate(['/profile']);
      },
      error: (err) => console.error('Failed to add destination', err),
    });
  }
}
