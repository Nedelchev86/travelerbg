import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { ActivityCategory } from '../activity-iterface';
import { FormUtilsService } from '../../services/form-utils.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

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
export class AddActivitiesComponent implements OnInit, OnDestroy {
  private ckEditorConfigService = inject(CKEditorConfigService);
  private unsubscribe$ = new Subject<void>();
  public addActivitieForm: FormGroup;
  public categories: any[] = [];
  public tags: FormArray;
  public imagePreviews: { [key: string]: string } = {};
  public Editor = this.ckEditorConfigService.Editor;
  public config = this.ckEditorConfigService.config;
  public loading: boolean = false;

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

  constructor(
    private fb: FormBuilder,
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
      highlight: [''],
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchCategories(): void {
    this.activityService
      .fetchCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
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
    this.loading = true;
    const formData = this.formDataService.createFormData(this.addActivitieForm);

    this.activityService.submitActivityForm(formData).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Activity added successfully');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.loading = false;
        this.toast.error('Failed to add activity');
        console.error('Error submitting activity form:', err);
      },
    });
  }
}
