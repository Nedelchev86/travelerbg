import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserDetails } from '../../user-interface';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { environment } from '../../../environments/environment';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ToastrService } from 'ngx-toastr';
import { CKEditorConfigService } from '../../shared/services/ckeditor-config.service';
import { TravelerService } from '../../services/traveler.service';

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CKEditorModule, LoaderComponent],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css',
})
export class EditProfileComponent implements OnInit {
  private ckEditorConfigService = inject(CKEditorConfigService);
  public Editor = this.ckEditorConfigService.Editor;
  public config = this.ckEditorConfigService.config;
  public loading = true;
  public profileForm: FormGroup;
  // profilePicture: File | null = null;
  // cover: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService,
    private cloudinaryuploadService: CloudinaryuploadService,
    private travelerService: TravelerService
  ) {
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
    this.travelerService.getProfileData().subscribe((data: any) => {
      this.profileForm.patchValue(data);
      this.loading = false;
    });
  }

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
        controlValue = '';
      }
      if (key === 'image') {
        if (controlValue instanceof File) {
          formData.append(key, controlValue);
        } else if (typeof controlValue === 'string' && controlValue !== '') {
          formData.append(key, controlValue);
        }
      } else {
        formData.append(key, controlValue);
      }
    });

    this.travelerService.updateProfileData(formData).subscribe(
      (response) => {
        this.authService.fetchUserData();
        this.router.navigate(['/profile']);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400 && error.error) {
          const errorMessage = this.extractErrorMessage(error.error);
          this.toast.error('Failed to update profile', errorMessage);
        } else {
          this.toast.error('Failed to update profile');
        }
        console.error('Failed to update profile', error);
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
