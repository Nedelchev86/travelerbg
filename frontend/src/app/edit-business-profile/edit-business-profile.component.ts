import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { CloudinaryuploadService } from '../shared/services/cloudinaryupload.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-edit-business-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-business-profile.component.html',
  styleUrl: './edit-business-profile.component.css',
})
export class EditBusinessProfileComponent {
  editProfileForm: FormGroup;
  userId: string | null = null;
  private readonly API_URL = environment.apiUrl;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);
  cloudinaryuploadService = inject(CloudinaryuploadService);

  constructor() {
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,20}$/)]],
      image: [null, Validators.required],
      linkedin: [''],
      facebook: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.http.get(`${this.API_URL}user/`).subscribe(
      (data: any) => {
        this.userId = data.user.user;
        this.editProfileForm.patchValue({
          name: data.user.name,
          description: data.user.description,
          location: data.user.location,
          phone: data.user.phone,
          image: data.user.image,
          linkedin_url: data.user.linkedin_url,
          facebook_url: data.user.facebook_url,
          activated: data.user.activated,
        });
      },
      (error) => {
        console.error('Failed to load profile data', error);
      }
    );
  }
  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.cloudinaryuploadService.uploadImage(file).subscribe(
        (response) => {
          this.editProfileForm.patchValue({
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
    if (this.editProfileForm.valid) {
      const formData = new FormData();
      Object.keys(this.editProfileForm.controls).forEach((key) => {
        let controlValue = this.editProfileForm.get(key)?.value;
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
        .put(`${this.API_URL}business/${this.userId}/`, formData)
        .subscribe(
          (response) => {
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
