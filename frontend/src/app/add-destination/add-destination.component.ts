import { CommonModule } from '@angular/common';
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
import { CloudinaryuploadService } from '../shared/services/cloudinaryupload.service';
import {
  MapGeocoder,
  MapAdvancedMarker,
  GoogleMap,
} from '@angular/google-maps';

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
} from 'ckeditor5';

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
  addDestinationForm: FormGroup;
  categories: any[] = [];
  tags: FormArray;

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
    private router: Router,
    private cloudinaryuploadService: CloudinaryuploadService
  ) {
    this.addDestinationForm = this.fb.group({
      title: [''],
      category: [''],
      basic_information: [''],
      image: ['', Validators.required],
      image2: [''],
      image3: [''],
      image4: [''],
      image5: [''],
      location: [''],
      time: [''],
      lat: [''], // Add lat control
      lng: [''], // Add lng control
      is_published: [true],
      tags: this.fb.array([], this.minLengthArray(1)),
      newTag: [''], // Input field for new tag
    });
    this.tags = this.addDestinationForm.get('tags') as FormArray;
  }

  public Editor = ClassicEditor;

  public config = {
    height: '800px',
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
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'strikethrough',
        'subscript',
        'superscript',
        'code',
        '|',
        'link',
        'Image',
        'blockQuote',
        'codeBlock',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        'outdent',
        'indent',
        'Link',
        'List',
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
      List,
      TodoList,
      Image,
    ],
  };

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
    this.http.get('http://localhost:8000/api/categories/').subscribe(
      (response: any) => {
        this.categories = response;
      },
      (error) => {
        console.error('Failed to fetch categories', error);
      }
    );
  }

  // onFileChange(event: any, field: string) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.addDestinationForm.patchValue({
  //       [field]: file,
  //     });

  //   }
  // }
  onFileChange(event: any, field: string): void {
    console.log('changed');
    const file = event.target.files[0];
    if (file) {
      this.cloudinaryuploadService.uploadImage(file).subscribe(
        (response) => {
          console.log('Image uploaded successfully:', response);
          this.addDestinationForm.patchValue({
            [field]: response.secure_url,
          });
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
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

  // onSubmit() {
  //   const formData = new FormData();
  //   Object.keys(this.addDestinationForm.controls).forEach((key) => {
  //     formData.append(key, this.addDestinationForm.get(key)?.value);
  //   });
  //   console.log('Form data', formData.getAll);
  //   this.http
  //     .post('http://localhost:8000/api/destinations/', formData)
  //     .subscribe(
  //       (response) => {
  //         console.log('Destination added successfully', response);
  //         this.router.navigate(['/profile']);
  //       },
  //       (error) => {
  //         console.error('Failed to add destination', error);
  //       }
  //     );
  // }
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

    const formData = new FormData();
    Object.keys(this.addDestinationForm.controls).forEach((key) => {
      if (key === 'tags') {
        const tags = this.tags.value;
        tags.forEach((tag: string, index: number) => {
          formData.append(`tags[${index}]`, tag);
        });
      } else if (key !== 'newTag') {
        const controlValue = this.addDestinationForm.get(key)?.value;
        if (controlValue instanceof File) {
          formData.append(key, controlValue);
        } else {
          formData.append(key, controlValue ?? '');
        }
      }
    });

    this.http
      .post('http://localhost:8000/api/destinations/', formData)
      .subscribe(
        (response) => {
          console.log('Destination added successfully', response);
          this.router.navigate(['/profile']);
        },
        (error) => {
          console.error('Failed to add destination', error);
        }
      );
  }
}
