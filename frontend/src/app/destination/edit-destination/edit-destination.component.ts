import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MapGeocoder,
  GoogleMap,
  MapAdvancedMarker,
} from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { minLengthArray } from '../../validators/minLengthArray.validator';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';
import { CKEditorConfigService } from '../../shared/services/ckeditor-config.service';
import { DestinationService } from '../../services/destination.service';
import { Destination } from '../destination-interface';
import { FormUtilsService } from '../../services/form-utils.service';

@Component({
  selector: 'app-edit-destination',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CKEditorModule,
    GoogleMap,
    MapAdvancedMarker,
  ],
  templateUrl: './edit-destination.component.html',
  styleUrl: './edit-destination.component.css',
})
export class EditDestinationComponent implements OnInit {
  private ckEditorConfigService = inject(CKEditorConfigService);
  @Input() id!: string;
  editDestinationForm: FormGroup;
  categories: any[] = [];
  tags: FormArray;
  destinationId: number | null = null;
  imagePreviews: { [key: string]: string } = {};
  public Editor = this.ckEditorConfigService.Editor;
  public config = this.ckEditorConfigService.config;

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
    private cloudinaryuploadService: CloudinaryuploadService,
    private destinationService: DestinationService,
    private formDataService: FormUtilsService
  ) {
    this.editDestinationForm = this.fb.group({
      title: ['', Validators.required],
      tags: this.fb.array([], minLengthArray(1)),
      category: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      image2: [''],
      image3: [''],
      image4: [''],
      image5: [''],
      lat: [''],
      lng: [''],
      time: [''],
      location: ['', Validators.required],
      newTag: [''], // Input field for new tag
      is_published: [true],
    });
    this.tags = this.editDestinationForm.get('tags') as FormArray;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.destinationId = params['id'];
      if (this.destinationId) {
        this.getDestinationDetails(this.destinationId);
        this.fetchCategories();
      }
    });
  }

  fetchCategories(): void {
    this.destinationService.fetchCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (err) => console.error('Failed to fetch categories', err),
    });
  }

  getDestinationDetails(destinationId: number): void {
    this.destinationService.fetchDestinationDetails(destinationId).subscribe({
      next: (data: Destination) => {
        this.editDestinationForm.patchValue(data);
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
        this.imagePreviews['image4'] = data.image4;
        this.imagePreviews['image5'] = data.image5;
      },
      error: (err) => {
        console.error('Failed to fetch destination details', err);
      },
    });
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.editDestinationForm.patchValue({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  }

  onLocationChange(): void {
    const location = this.editDestinationForm.get('location')?.value;
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
    const newTag = this.editDestinationForm.get('newTag')?.value;
    if (newTag) {
      this.addTag(newTag);
      this.editDestinationForm.get('newTag')?.reset();
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

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.cloudinaryuploadService.uploadImage(file).subscribe(
        (response) => {
          this.editDestinationForm.patchValue({
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
    this.editDestinationForm.patchValue({
      [field]: null,
    });
    delete this.imagePreviews[field];
  }

  onSubmit() {
    if (this.editDestinationForm.invalid) {
      this.editDestinationForm.markAllAsTouched();
      return;
    }
    const formData = this.formDataService.createFormData(
      this.editDestinationForm
    );

    this.destinationService
      .updateDestination(formData, this.destinationId!)
      .subscribe({
        next: () => {
          this.router.navigate(['/profile/my-destinations']);
        },
        error: (err) => console.error('Failed to update destination', err),
      });
  }
}
