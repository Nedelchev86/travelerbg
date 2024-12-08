import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserDetails, UserInterface } from '../../user-interface';
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
  ImageUpload,
} from 'ckeditor5';
import { environment } from '../../../environments/environment';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CKEditorModule, LoaderComponent],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css',
})
export class EditProfileComponent implements OnInit {
  loading = true;
  profileForm: FormGroup;
  profilePicture: File | null = null;
  cover: File | null = null;
  authService = inject(AuthService);
  toast = inject(ToastrService);
  router = inject(Router);
  cloudinaryuploadService = inject(CloudinaryuploadService);
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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.profileForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z][a-zA-Z\s]*$/),
          Validators.maxLength(30),
        ],
      ],
      city: ['', Validators.required],
      occupation: ['', Validators.required],
      website: [''],
      linkedin: [''],
      facebook: [''],
      youtube: [''],
      instagram: [''],
      about: ['', Validators.required],
      phone_number: ['', Validators.pattern('^[0-9]{10,15}$')],
      profile_picture: [''],
      cover: [''],
    });
  }

  ngOnInit(): void {
    // Fetch the current profile data and populate the form
    this.http.get(`${this.API_URL}traveler/update/`).subscribe((data: any) => {
      this.profileForm.patchValue(data);
      this.loading = false;
    });
  }

  // onFileChange(event: any, field: string): void {
  //   const file = event.target.files[0];
  //   if (field === 'profile_picture') {
  //     this.profilePicture = file;
  //   } else if (field === 'cover') {
  //     this.cover = file;
  //   }
  // }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.cloudinaryuploadService.uploadImage(file).subscribe(
        (response) => {
          this.profileForm.patchValue({
            [field]: response.secure_url,
          });
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.keys(this.profileForm.controls).forEach((key) => {
      let controlValue = this.profileForm.get(key)?.value;
      if (controlValue === null) {
        controlValue = ''; // Replace null with an empty string
      }
      if (key === 'image') {
        if (controlValue instanceof File) {
          formData.append(key, controlValue);
        } else if (typeof controlValue === 'string' && controlValue !== '') {
          formData.append(key, controlValue); // Append the existing URL if it's a string and not empty
        }
      } else {
        formData.append(key, controlValue);
      }
    });

    this.http
      .put<UserDetails>(`${this.API_URL}traveler/update/`, formData)
      .subscribe(
        (response) => {
          this.authService.fetchUserData();
          this.router.navigate(['/profile']);
        },
        (error) => {
          this.toast.error('Failed to update profile', error);
          const errorMessage = this.extractErrorMessage(error.error);
          this.toast.error(errorMessage, 'Failed to update profile');
        }
      );
  }

  private extractErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    } else if (Array.isArray(error)) {
      return error.join(', ');
    } else if (typeof error === 'object') {
      return Object.values(error).flat().join(', ');
    }
    return 'An unknown error occurred';
  }
}
