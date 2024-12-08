import { HttpClient } from '@angular/common/http';
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
  GoogleMap,
  MapAdvancedMarker,
  MapGeocoder,
} from '@angular/google-maps';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonModule } from '@angular/common';
import { CKEditorConfigService } from '../../shared/services/ckeditor-config.service';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';
import { ActivityService } from '../../services/activity.service';
import { minLengthArray } from '../../validators/minLengthArray.validator';
import { ActivityCategory } from '../activities/activity-iterface';
import { FormUtilsService } from '../../services/form-utils.service';
import { ToastrService } from 'ngx-toastr';

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
  private ckEditorConfigService = inject(CKEditorConfigService);
  addActivitieForm: FormGroup;
  categories: any[] = [];
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
  geocoder = inject(MapGeocoder);

  public Editor = this.ckEditorConfigService.Editor;
  public config = this.ckEditorConfigService.config;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cloudinaryuploadService: CloudinaryuploadService,
    private activityService: ActivityService,
    private formDataService: FormUtilsService,
    private toast: ToastrService
  ) {
    this.addActivitieForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      highlight: ['', Validators.required],
      image: ['', Validators.required],
      image2: [''],
      image3: [''],
      location: ['', Validators.required],
      duration: ['', Validators.required],
      price: ['', Validators.required],
      lat: [''],
      lng: [''],
      is_published: [true],
      tags: this.fb.array([], minLengthArray(1)),
      newTag: [''],
    });
    this.tags = this.addActivitieForm.get('tags') as FormArray;
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.activityService.fetchCategories().subscribe({
      next: (data: ActivityCategory[]) => {
        this.categories = data;
      },
      error: (err) => console.log(err),
    });
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
    const formData = this.formDataService.createFormData(this.addActivitieForm);
    // const formData = new FormData();
    // Object.keys(this.addActivitieForm.controls).forEach((key) => {
    //   if (key === 'tags') {
    //     const tags = this.tags.value;
    //     tags.forEach((tag: string, index: number) => {
    //       formData.append(`tags[${index}]`, tag);
    //     });
    //   } else if (key !== 'newTag') {
    //     const controlValue = this.addActivitieForm.get(key)?.value;
    //     if (controlValue instanceof File) {
    //       formData.append(key, controlValue);
    //     } else {
    //       formData.append(key, controlValue ?? '');
    //     }
    //   }
    // });

    this.activityService.submitActivityForm(formData).subscribe({
      next: () => {
        this.toast.success('Activity added successfully');
        this.router.navigate(['/activities']);
      },
      error: (err) => {
        this.toast.error('Failed to add activity');
        console.error('Error submitting activity form:', err);
      },
    });
  }
}
