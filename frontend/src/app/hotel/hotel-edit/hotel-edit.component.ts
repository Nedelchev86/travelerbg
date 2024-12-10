import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import {
  GoogleMap,
  MapAdvancedMarker,
  MapGeocoder,
} from '@angular/google-maps';

import { CKEditorConfigService } from '../../shared/services/ckeditor-config.service';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';
import { HotelService } from '../../services/hotel.service';
import { Hotel, HotelsCategory } from '../hotel-interface';
import { minLengthArray } from '../../validators/minLengthArray.validator';
import { FormUtilsService } from '../../services/form-utils.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

export interface Highlight {
  id: number;
  name: string;
}

@Component({
  selector: 'app-hotel-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CKEditorModule,
    GoogleMap,
    MapAdvancedMarker,
    LoaderComponent,
  ],
  templateUrl: './hotel-edit.component.html',
  styleUrl: './hotel-edit.component.css',
})
export class HotelEditComponent {
  public loading = true;
  public imagePreviews: { [key: string]: string } = {};
  public highlights: Highlight[] = [];
  public editHotelForm: FormGroup;
  public tags: FormArray;
  public hotelId: number | null = null;
  public categories: HotelsCategory[] = [];
  public center: google.maps.LatLngLiteral = { lat: 42.504792, lng: 27.462636 };
  public zoom = 15;
  public markerPosition: google.maps.LatLngLiteral = {
    lat: 42.504792,
    lng: 27.462636,
  };
  public mapOptions: google.maps.MapOptions = {
    mapId: '453204c6eedd332f',
    gestureHandling: 'greedy',
  };
  public geocoder = inject(MapGeocoder);
  private ckEditorConfigService = inject(CKEditorConfigService);
  public Editor = this.ckEditorConfigService.Editor;
  public config = this.ckEditorConfigService.config;
  public submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cloudinaryuploadService: CloudinaryuploadService,
    private hotelService: HotelService,
    private formDataService: FormUtilsService,
    public toast: ToastrService,
    public authSevices: AuthService
  ) {
    this.editHotelForm = this.fb.group({
      name: ['', Validators.required],
      category: [''],
      description: ['', Validators.required],
      location: ['', Validators.required],
      website: ['', Validators.pattern('https?://.+')],
      highlights: this.fb.array([]),
      price: ['', [Validators.required, Validators.min(0)]],
      tags: this.fb.array([], minLengthArray(1)),
      newTag: [''], // Input field for new tag
      image: ['', Validators.required],
      image2: [''],
      image3: [''],
      image4: [''],
      lat: [''], // Add lat control
      lng: [''], // Add lng control
    });
    this.tags = this.editHotelForm.get('tags') as FormArray;
    // this.highlights = this.editHotelForm.get('tags') as FormArray;
  }

  ngOnInit(): void {
    this.hotelId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.hotelId) {
      this.fetchCategories();
      this.fetchHighlights();
      this.loadHotelData(this.hotelId);
    }
  }

  fetchCategories(): void {
    this.hotelService.fetchHotelCategories().subscribe({
      next: (data: HotelsCategory[]) => {
        this.categories = data;
      },
      error: (err) => console.log(err),
    });
  }

  fetchHighlights(): void {
    this.hotelService.fetchHighlights().subscribe({
      next: (response: Highlight[]) => {
        this.highlights = response;
        // If hotel data is already loaded, mark the checked highlights
      },
      error: (error) => {
        console.error('Error fetching highlights:', error);
      },
    });
  }

  loadHotelData(hotelId: number): void {
    this.hotelService.getHotelDetails(hotelId).subscribe({
      next: (response: Hotel) => {
        this.loading = false;
        this.editHotelForm.patchValue(response);
        if (response.lat && response.lng) {
          this.center = {
            lat: Number(response.lat),
            lng: Number(response.lng),
          };
          this.markerPosition = {
            lat: Number(response.lat),
            lng: Number(response.lng),
          };
        } else {
          this.geocodeAddress(response.location);
        }

        response.tags.forEach((tag: { id: Number; name: string }) => {
          this.tags.push(this.fb.control(tag.name, Validators.required));
        });
        this.markCheckedHighlights(response.highlights);
        this.imagePreviews['image'] = response.image;
        this.imagePreviews['image2'] = response.image2;
        this.imagePreviews['image3'] = response.image3;
        this.imagePreviews['image4'] = response.image4;
      },
      error: (error) => {
        console.error('Failed to fetch destination details', error);
      },
    });
  }

  removeImage(field: string): void {
    this.editHotelForm.patchValue({
      [field]: '',
    });
    delete this.imagePreviews[field];
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.editHotelForm.patchValue({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
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

  onHighlightsChange(event: any): void {
    const highlightsFormArray = this.editHotelForm.get(
      'highlights'
    ) as FormArray;
    const value = Number(event.target.value); // Convert value to number
    if (event.target.checked) {
      highlightsFormArray.push(this.fb.control(value));
    } else {
      const index = highlightsFormArray.controls.findIndex(
        (x) => x.value === value
      );
      highlightsFormArray.removeAt(index);
    }
  }

  markCheckedHighlights(hotelHighlights: any[]): void {
    const highlightsFormArray = this.editHotelForm.get(
      'highlights'
    ) as FormArray;
    this.highlights.forEach((highlight) => {
      const isChecked = hotelHighlights.some(
        (hotelHighlight) => hotelHighlight.id === highlight.id
      );

      if (isChecked) {
        highlightsFormArray.push(this.fb.control(highlight.id));
      }
    });
  }

  onLocationChange(): void {
    const location = this.editHotelForm.get('location')?.value;
    if (location) {
      this.geocodeAddress(location);
    }
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.cloudinaryuploadService.uploadImage(file).subscribe(
        (response) => {
          this.editHotelForm.patchValue({
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

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  addNewTag(): void {
    const newTag = this.editHotelForm.get('newTag')?.value;
    if (newTag) {
      this.addTag(newTag);
      this.editHotelForm.get('newTag')?.reset();
    }
  }

  addTag(tagName: string = ''): void {
    if (tagName && !this.tags.value.includes(tagName)) {
      this.tags.push(this.fb.control(tagName, Validators.required));
    }
  }
  onSubmit(): void {
    if (this.editHotelForm.invalid) {
      this.editHotelForm.markAllAsTouched();
      return;
    }

    const formData = this.formDataService.createFormData(this.editHotelForm);
    this.submitting = true;

    this.hotelService.updateHotelForm(formData, this.hotelId!).subscribe({
      next: () => {
        this.submitting = false;
        this.toast.success('Hotel updated successfully');
        this.authSevices.fetchUserData();
        this.router.navigate(['/profile/my-hotels']);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Error submitting hotel form:', err);
        this.toast.error('Failed to updated hotel');
      },
    });
  }
}
