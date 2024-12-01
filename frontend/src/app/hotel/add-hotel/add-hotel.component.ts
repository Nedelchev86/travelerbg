import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  GoogleMap,
  MapAdvancedMarker,
  MapGeocoder,
} from '@angular/google-maps';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';
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
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
export interface Highlight {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GoogleMap,
    MapAdvancedMarker,
    CKEditorModule,
  ],
  templateUrl: './add-hotel.component.html',
  styleUrl: './add-hotel.component.css',
})
export class AddHotelComponent implements OnInit {
  authSevices = inject(AuthService);
  imagePreviews: { [key: string]: string } = {};
  addHotelForm: FormGroup;
  tags: FormArray;
  highlights: Highlight[] = [];
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

  categories: any = Array<any>();

  public Editor = ClassicEditor;
  private readonly API_URL = environment.apiUrl;

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cloudinaryuploadService: CloudinaryuploadService
  ) {
    this.addHotelForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      website: ['', Validators.pattern('https?://.+')],
      highlights: this.fb.array([]),
      price: ['', [Validators.required, Validators.min(0)]],
      tags: this.fb.array([], this.minLengthArray(1)),
      newTag: [''], // Input field for new tag
      image: ['', Validators.required],
      image2: [''],
      image3: [''],
      image4: [''],
      lat: [''], // Add lat control
      lng: [''], // Add lng control
    });

    this.tags = this.addHotelForm.get('tags') as FormArray;
  }

  minLengthArray(min: number) {
    return (c: AbstractControl): ValidationErrors | null => {
      if (c instanceof FormArray && c.length >= min) {
        return null;
      }
      return { minLengthArray: true };
    };
  }

  ngOnInit(): void {
    this.fetchHighlights();
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.http.get(`${this.API_URL}categories/hotels/`).subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err) => console.log(err),
    });
  }

  fetchHighlights(): void {
    this.http.get<Highlight[]>(`${this.API_URL}highlights/`).subscribe(
      (response: Highlight[]) => {
        this.highlights = response;
        const highlightsFormArray = this.addHotelForm.get(
          'highlights'
        ) as FormArray;
        this.highlights.forEach(() => {
          highlightsFormArray.push(this.fb.control(false));
        });
      },
      (error) => {
        console.error('Error fetching highlights:', error);
      }
    );
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
          this.addHotelForm.patchValue({
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
    this.addHotelForm.patchValue({
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
      this.addHotelForm.patchValue({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  }

  onLocationChange(): void {
    const location = this.addHotelForm.get('location')?.value;
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

  onHighlightsChange(event: any): void {
    const highlightsFormArray = this.addHotelForm.get(
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

  addNewTag(): void {
    const newTag = this.addHotelForm.get('newTag')?.value;
    if (newTag) {
      this.addTag(newTag);
      this.addHotelForm.get('newTag')?.reset();
    }
  }

  onSubmit(): void {
    if (this.addHotelForm.valid) {
      const formData = new FormData();
      Object.keys(this.addHotelForm.controls).forEach((key) => {
        if (key === 'tags') {
          const tags = this.tags.value;
          tags.forEach((tag: string, index: number) => {
            formData.append(`tags[${index}]`, tag);
          });
        } else if (key === 'highlights') {
          const highlights = this.addHotelForm.get('highlights')?.value;
          const selectedHighlights = highlights.filter(
            (highlight: number | boolean) => highlight !== false
          );
          selectedHighlights.forEach((highlight: number, index: number) => {
            formData.append(`highlights[${index}]`, highlight.toString());
          });
        } else if (key !== 'newTag') {
          const controlValue = this.addHotelForm.get(key)?.value;
          if (controlValue instanceof File) {
            formData.append(key, controlValue);
          } else {
            formData.append(key, controlValue ?? '');
          }
        }
      });
      //   onSubmit(): void {
      //     if (this.addHotelForm.valid) {
      //       const formData = new FormData();
      //       Object.keys(this.addHotelForm.controls).forEach((key) => {
      //         if (key === 'tags') {
      //           const tags = this.tags.value;
      //           tags.forEach((tag: string, index: number) => {
      //             formData.append(`tags[${index}]`, tag);
      //           });
      //         } else {
      //           const controlValue = this.addHotelForm.get(key)?.value;
      //           if (controlValue instanceof File) {
      //             formData.append(key, controlValue);
      //           } else {
      //             formData.append(key, controlValue ?? '');
      //           }
      //         }
      //       });

      this.http.post(`${this.API_URL}hotels/`, formData).subscribe(
        (response) => {
          this.authSevices.fetchUserData();
          this.router.navigate(['/profile']);
        },
        (error) => {
          console.error('Error adding hotel', error);
        }
      );
    } else {
      this.addHotelForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
}
