import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Activity, ActivityCategory } from '../activity-iterface';
import { ActivityService } from '../../services/activity.service';
import { minLengthArray } from '../../validators/minLengthArray.validator';
import {
  GoogleMap,
  MapAdvancedMarker,
  MapGeocoder,
} from '@angular/google-maps';
import { CKEditorConfigService } from '../../shared/services/ckeditor-config.service';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';
import { FormUtilsService } from '../../services/form-utils.service';

@Component({
  selector: 'app-edit-activitie',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CKEditorModule,
    GoogleMap,
    MapAdvancedMarker,
    LoaderComponent,
  ],
  templateUrl: './edit-activitie.component.html',
  styleUrl: './edit-activitie.component.css',
})
export class EditActivitieComponent implements OnInit, OnDestroy {
  private ckEditorConfigService = inject(CKEditorConfigService);
  private unsubscribe$ = new Subject<void>();
  public editActivityForm: FormGroup;
  public activityId: number | null = null;
  public loading: boolean = false;
  public tags: FormArray;
  public Editor = this.ckEditorConfigService.Editor;
  public config = this.ckEditorConfigService.config;
  public imagePreviews: { [key: string]: string } = {};
  public categories: ActivityCategory[] = [];
  public submitting: boolean = false;

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
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private activityService: ActivityService,
    private cloudinaryuploadService: CloudinaryuploadService,
    private formDataService: FormUtilsService
  ) {
    this.editActivityForm = this.fb.group({
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
    this.tags = this.editActivityForm.get('tags') as FormArray;
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.activityId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.activityId) {
      this.loadActivityData();
    }
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addTag(tag: string): void {
    this.tags.push(this.fb.control(tag));
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  removeImage(field: string): void {
    this.editActivityForm.patchValue({
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
      this.editActivityForm.patchValue({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  }

  onLocationChange(): void {
    const location = this.editActivityForm.get('location')?.value;
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

  loadActivityData(): void {
    this.loading = true;
    this.activityService
      .getActivityDetails(this.activityId!)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: Activity) => {
          this.editActivityForm.patchValue(data);
          if (data.lat && data.lng) {
            this.center = {
              lat: Number(data.lat),
              lng: Number(data.lng),
            };
            this.markerPosition = {
              lat: Number(data.lat),
              lng: Number(data.lng),
            };
          } else {
            this.geocodeAddress(data.location);
          }

          data.tags.forEach((tag: { id: Number; name: string }) => {
            this.tags.push(this.fb.control(tag.name, Validators.required));
          });

          this.imagePreviews['image'] = data.image;
          this.imagePreviews['image2'] = data.image2;
          this.imagePreviews['image3'] = data.image3;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load activity data', err);
          this.toast.error('Failed to load activity data');
          this.loading = false;
        },
      });
  }

  addNewTag(): void {
    const newTag = this.editActivityForm.get('newTag')?.value;
    if (newTag) {
      this.addTag(newTag);
      this.editActivityForm.get('newTag')?.reset();
    }
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.cloudinaryuploadService.uploadImage(file).subscribe({
        next: (response) => {
          this.editActivityForm.patchValue({
            [field]: response.secure_url,
          });
          this.imagePreviews[field] = response.secure_url;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.toast.error('Error uploading image');
        },
      });
    }
  }

  onSubmit(): void {
    if (this.editActivityForm.invalid) {
      this.editActivityForm.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const formData = this.formDataService.createFormData(this.editActivityForm);

    this.activityService
      .updateActivity(formData, this.activityId!)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.toast.success('Activity updated successfully');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.submitting = false;
          this.toast.error('Failed to update activity');
          console.error('Error updating activity:', err);
        },
      });
  }
}
