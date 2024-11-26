import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  MapGeocoder,
  GoogleMap,
  MapAdvancedMarker,
} from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Image,
  Link,
  List,
  TodoList,
  BlockQuote,
  Heading,
  FontFamily,
  FontSize,
  FontColor,
} from 'ckeditor5';
import { environment } from '../../../environments/environment';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';

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
  @Input() id!: string;
  editDestinationForm: FormGroup;
  categories: any[] = [];
  tags: FormArray;
  destinationId: string | null = null;
  imagePreviews: { [key: string]: string } = {};
  private readonly API_URL = environment.apiUrl;
  public Editor = ClassicEditor;
  public config = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'heading',
        '|',
        'fontfamily',
        'fontsize',
        'fontColor',
        '|',
        'bold',
        'italic',
        '|',
        'link',
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      Bold,
      Essentials,
      Italic,
      Mention,
      Paragraph,
      Undo,
      BlockQuote,
      Link,
      TodoList,
      Image,
      Heading,
      FontFamily,
      FontSize,
      FontColor,
    ],
  };

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
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cloudinaryuploadService: CloudinaryuploadService
  ) {
    this.editDestinationForm = this.fb.group({
      title: ['', Validators.required],
      tags: this.fb.array([], this.minLengthArray(1)),
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
    this.fetchCategories();
    this.destinationId = this.route.snapshot.paramMap.get('id');
    if (this.destinationId) {
      this.getDestinationDetails(this.destinationId);
    }
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
    this.http.get(`${this.API_URL}categories/`).subscribe(
      (response: any) => {
        this.categories = response;
      },
      (error) => {
        console.error('Failed to fetch categories', error);
      }
    );
  }

  getDestinationDetails(destinationId: string): void {
    this.http.get(`${this.API_URL}destinations/${destinationId}/`).subscribe(
      (response: any) => {
        this.editDestinationForm.patchValue(response);
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

        this.imagePreviews['image'] = response.image;
        this.imagePreviews['image2'] = response.image2;
        this.imagePreviews['image3'] = response.image3;
        this.imagePreviews['image4'] = response.image4;
        this.imagePreviews['image5'] = response.image5;
      },
      (error) => {
        console.error('Failed to fetch destination details', error);
      }
    );
  }
  //   this.http.get(`http://localhost:8000/api/destinations/${id}/`).subscribe(
  //     (data: any) => {
  //       this.editDestinationForm.patchValue(data);
  //     },
  //     (error) => {
  //       console.error('Failed to fetch destination details', error);
  //     }
  //   );
  // }

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

    const formData = new FormData();
    Object.keys(this.editDestinationForm.controls).forEach((key) => {
      if (key === 'tags') {
        const tags = this.tags.value;
        tags.forEach((tag: string, index: number) => {
          formData.append(`tags[${index}]`, tag);
        });
      } else if (key !== 'newTag') {
        const controlValue = this.editDestinationForm.get(key)?.value;
        if (controlValue instanceof File) {
          formData.append(key, controlValue);
        } else {
          formData.append(key, controlValue ?? '');
        }
      }
    });

    this.http
      .put(`${this.API_URL}destinations/${this.destinationId}/`, formData)
      .subscribe(
        (response) => {
          this.router.navigate(['/profile/my-destinations']);
        },
        (error) => {
          console.error('Failed to update destination', error);
        }
      );
  }
}
