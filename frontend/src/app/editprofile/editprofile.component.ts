import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserDetails, UserInterface } from '../user-interface';
import { CloudinaryuploadService } from '../shared/services/cloudinaryupload.service';
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
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CKEditorModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css',
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  profilePicture: File | null = null;
  cover: File | null = null;
  authService = inject(AuthService);
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
          Validators.pattern(/^[a-zA-Z\s]*$/),
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
      console.log('Profile data fetched successfully', data);
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
    console.log('changed');
    const file = event.target.files[0];
    if (file) {
      this.cloudinaryuploadService.uploadImage(file).subscribe(
        (response) => {
          console.log('Image uploaded successfully:', response);
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
    if (this.profileForm.valid) {
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
      // console.log('Profile form submitted', this.profileForm.value);
      // if (this.profileForm.valid) {
      //   const formData = new FormData();
      //   formData.append('name', this.profileForm.value.name);
      //   formData.append('city', this.profileForm.value.city);
      //   formData.append('nationality', this.profileForm.value.nationality);
      //   formData.append('occupation', this.profileForm.value.occupation);
      //   formData.append('website', this.profileForm.value.website || '');
      //   formData.append('linkedin', this.profileForm.value.linkedin || '');
      //   formData.append('facebook', this.profileForm.value.facebook || '');
      //   formData.append('github', this.profileForm.value.github || '');
      //   formData.append('about', this.profileForm.value.about);
      //   formData.append(
      //     'phone_number',
      //     this.profileForm.value.phone_number || ''
      //   );

      //   if (this.profilePicture) {
      //     formData.append('profile_picture', this.profilePicture);
      //   }
      //   if (this.cover) {
      //     formData.append('cover', this.cover);
      //   }

      this.http
        .put<UserDetails>(`${this.API_URL}traveler/update/`, formData)
        .subscribe(
          (response) => {
            console.log('Profile updated successfully', response);

            this.authService.fetchUserData();
            this.router.navigate(['/profile']);
          },
          (error) => {
            console.error('Failed to update profile', error);
          }
        );
    }
  }
}
