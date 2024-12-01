import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  GoogleMap,
  MapAdvancedMarker,
  MapGeocoder,
} from '@angular/google-maps';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { CKEditorConfigService } from '../../shared/services/ckeditor-config.service';
import { environment } from '../../../environments/environment';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';

@Component({
  selector: 'app-add-activities',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GoogleMap,
    CKEditorModule,
    MapAdvancedMarker,
    CommonModule,
  ],
  templateUrl: './add-activities.component.html',
  styleUrl: './add-activities.component.css',
})
export class AddActivitiesComponent {
  addActivitieForm: FormGroup;
  categories: any[] = [];
  tags: FormArray;
  imagePreviews: { [key: string]: string } = {};
  authSevices = inject(AuthService);

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
  geocoder = inject(MapGeocoder);

  private ckEditorConfigService = inject(CKEditorConfigService);
  public Editor = this.ckEditorConfigService.Editor;
  public config = this.ckEditorConfigService.config;
  private readonly API_URL = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cloudinaryuploadService: CloudinaryuploadService
  ) {
    this.addActivitieForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      highlights: ['', Validators.required],
      image: ['', Validators.required],
      image2: [''],
      image3: [''],
      location: ['', Validators.required],
      duration: ['', Validators.required],
      price: ['', Validators.required],
      lat: [''], // Add lat control
      lng: [''], // Add lng control
      is_published: [true],
      tags: this.fb.array([], this.minLengthArray(1)),
      newTag: [''], // Input field for new tag
    });
    this.tags = this.addActivitieForm.get('tags') as FormArray;
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  minLengthArray(min: number) {
    return (c: AbstractControl): ValidationErrors | null => {
      if (c instanceof FormArray && c.length >= min) {
        return null;
      }
      return { minLengthArray: true };
    };
  }

  fetchCategories(): void {
    this.http.get(`${this.API_URL}categories/activities/`).subscribe(
      (response: any) => {
        this.categories = response;
      },
      (error) => {
        console.error('Failed to fetch categories', error);
      }
    );
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.cloudinaryuploadService.uploadImage(file).subscribe(
        (response) => {
          this.addActivitieForm.patchValue({
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
    this.addActivitieForm.patchValue({
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
      this.addActivitieForm.patchValue({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  }

  onLocationChange(): void {
    const location = this.addActivitieForm.get('location')?.value;
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
    const newTag = this.addActivitieForm.get('newTag')?.value;
    if (newTag) {
      this.addTag(newTag);
      this.addActivitieForm.get('newTag')?.reset();
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
    if (this.addActivitieForm.invalid) {
      this.addActivitieForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.keys(this.addActivitieForm.controls).forEach((key) => {
      if (key === 'tags') {
        const tags = this.tags.value;
        tags.forEach((tag: string, index: number) => {
          formData.append(`tags[${index}]`, tag);
        });
      } else if (key !== 'newTag') {
        const controlValue = this.addActivitieForm.get(key)?.value;
        if (controlValue instanceof File) {
          formData.append(key, controlValue);
        } else {
          formData.append(key, controlValue ?? '');
        }
      }
    });

    this.http.post(`${this.API_URL}activities/`, formData).subscribe(
      (response) => {
        this.authSevices.fetchUserData();
        this.router.navigate(['/profile']);
      },
      (error) => {
        console.error('Failed to add destination', error);
      }
    );
  }
}
