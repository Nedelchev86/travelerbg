import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';
import { BusinessService } from '../../services/business.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-business-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './edit-business-profile.component.html',
  styleUrl: './edit-business-profile.component.css',
})
export class EditBusinessProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public editProfileForm: FormGroup;
  public userId: number | null = null;
  public loading = false;
  public imagePreviews: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cloudinaryuploadService: CloudinaryuploadService,
    private businessService: BusinessService,
    private toast: ToastrService
  ) {
    this.editProfileForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z][a-zA-Z\s]*$/),
          Validators.maxLength(30),
        ],
      ],
      description: ['', Validators.required],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,20}$/)]],
      image: [null, Validators.required],
      linkedin: [''],
      facebook: [''],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadProfileData();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadProfileData(): void {
    this.businessService.getProfileData().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data: any) => {
        this.imagePreviews['image'] = data.user.image;
        this.userId = data.user.user;
        this.editProfileForm.patchValue(data.user);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load profile data', err);
        this.toast.error('Failed to load profile data');
        this.loading = false;
      },
    });
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.cloudinaryuploadService.uploadImage(file).subscribe({
        next: (response) => {
          this.editProfileForm.patchValue({
            [field]: response.secure_url,
          });
          this.imagePreviews[field] = response.secure_url;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.toast.error('Error uploading image');
        },
      });
    }
  }

  removeImage(field: string): void {
    this.editProfileForm.patchValue({
      [field]: null,
    });
    delete this.imagePreviews[field];
  }

  onSubmit(): void {
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAllAsTouched();
      return;
    }

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

    this.businessService.updateProfileData(formData, this.userId!).subscribe(
      (response) => {
        this.authService.fetchUserData();
        this.toast.success('Profile updated successfully');
        this.router.navigate(['/profile']);
      },
      (error) => {
        console.error('Failed to update profile', error);
        this.toast.error('Failed to update profile');
      }
    );
  }
}
