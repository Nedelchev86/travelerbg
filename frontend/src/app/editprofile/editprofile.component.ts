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

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css',
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  profilePicture: File | null = null;
  cover: File | null = null;
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Z][a-z]*$')]],

      city: ['', Validators.required],
      nationality: ['', Validators.required],
      occupation: ['', Validators.required],
      website: [''],
      linkedin: [''],
      facebook: [''],
      github: [''],
      about: ['', Validators.required],
      phone_number: ['', Validators.pattern('^[0-9]{10,15}$')],
      profile_picture: [''],
      cover: [''],
    });
  }

  ngOnInit(): void {
    // Fetch the current profile data and populate the form
    this.http
      .get('http://localhost:8000/api/traveler/update/')
      .subscribe((data: any) => {
        this.profileForm.patchValue(data);
        console.log('Profile data fetched successfully', data);
      });
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (field === 'profile_picture') {
      this.profilePicture = file;
    } else if (field === 'cover') {
      this.cover = file;
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = new FormData();
      formData.append('name', this.profileForm.value.name);
      formData.append('city', this.profileForm.value.city);
      formData.append('nationality', this.profileForm.value.nationality);
      formData.append('occupation', this.profileForm.value.occupation);
      formData.append('website', this.profileForm.value.website || '');
      formData.append('linkedin', this.profileForm.value.linkedin || '');
      formData.append('facebook', this.profileForm.value.facebook || '');
      formData.append('github', this.profileForm.value.github || '');
      formData.append('about', this.profileForm.value.about);
      formData.append(
        'phone_number',
        this.profileForm.value.phone_number || ''
      );

      if (this.profilePicture) {
        formData.append('profile_picture', this.profilePicture);
      }
      if (this.cover) {
        formData.append('cover', this.cover);
      }

      this.http
        .put<UserDetails>(
          'http://localhost:8000/api/traveler/update/',
          formData
        )
        .subscribe(
          (response) => {
            console.log('Profile updated successfully', response);

            this.authService.updateUserDetails(response as UserDetails);
            this.router.navigate(['/profile']);
          },
          (error) => {
            console.error('Failed to update profile', error);
          }
        );
    }
  }
}
