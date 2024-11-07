import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-destination',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-destination.component.html',
  styleUrl: './edit-destination.component.css',
})
export class EditDestinationComponent implements OnInit {
  @Input() id!: string;
  editDestinationForm: FormGroup;
  categories: any[] = [];
  destinationId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editDestinationForm = this.fb.group({
      title: ['', Validators.required],
      tags: ['', Validators.required],
      category: ['', Validators.required],
      basic_information: ['', Validators.required],
      responsibilities: ['', Validators.required],
      benefits: [''],
      image: [null],
      image2: [null],
      image3: [null],
      image4: [null],
      image5: [null],
      image6: [null],
      vacancy: [''],
      location: ['', Validators.required],
      cost: [''],
      is_published: [true],
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.destinationId = this.route.snapshot.paramMap.get('id');
    if (this.destinationId) {
      this.getDestinationDetails(this.destinationId);
    }
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

  getDestinationDetails(id: string): void {
    this.http.get(`http://localhost:8000/api/destinations/${id}/`).subscribe(
      (data: any) => {
        this.editDestinationForm.patchValue(data);
      },
      (error) => {
        console.error('Failed to fetch destination details', error);
      }
    );
  }

  onFileChange(event: any, field: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.editDestinationForm.patchValue({
        [field]: file,
      });
    }
  }

  onSubmit() {
    if (this.editDestinationForm.invalid) {
      this.editDestinationForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.keys(this.editDestinationForm.controls).forEach((key) => {
      formData.append(key, this.editDestinationForm.get(key)?.value);
    });

    if (this.destinationId) {
      this.http
        .put(
          `http://localhost:8000/api/destinations/${this.destinationId}/`,
          formData
        )
        .subscribe(
          (response) => {
            console.log('Destination updated successfully', response);
            this.router.navigate(['/profile/my-destinations']);
          },
          (error) => {
            console.error('Failed to update destination', error);
          }
        );
    } else {
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
}
