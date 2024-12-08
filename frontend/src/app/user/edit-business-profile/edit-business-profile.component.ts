import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CloudinaryuploadService } from '../../shared/services/cloudinaryupload.service';
import { environment } from '../../../environments/environment';
import { BussinessDetails } from '../../user-interface';
import { BusinessService } from '../../services/business.service';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-edit-business-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './edit-business-profile.component.html',
  styleUrl: './edit-business-profile.component.css',
})
export class EditBusinessProfileComponent {
  public editProfileForm: FormGroup;
  public userId: number | null = null;
  public loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cloudinaryuploadService: CloudinaryuploadService,
    private businessService: BusinessService
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

  loadProfileData(): void {
    this.businessService.getProfileData().subscribe(
      (data: any) => {
        this.userId = data.user.user;
        this.editProfileForm.patchValue(data.user);
        this.loading = false;
      },
      (error) => {
        console.error('Failed to load profile data', error);
        this.loading = false;
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
        this.router.navigate(['/profile']);
      },
      (error) => {
        console.error('Failed to update profile', error);
      }
    );
  }
}
