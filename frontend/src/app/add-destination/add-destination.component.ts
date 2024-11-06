import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-destination',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-destination.component.html',
  styleUrl: './add-destination.component.css',
})
export class AddDestinationComponent {
  addDestinationForm: FormGroup;
  categories: any[] = [];


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.addDestinationForm = this.fb.group({
      title: [''],
      tags: [''],
      category: [''],
      basic_information: [''],
      responsibilities: [''],
      benefits: [''],
      image: [null, Validators.required],
      image2: [null],
      image3: [null],
      image4: [null],
      image5: [null],
      image6: [null],
      vacancy: [''],
      location: [''],
      cost: [''],
      is_published: [true],
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
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

  onFileChange(event: any, field: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addDestinationForm.patchValue({
        [field]: file,
      });

    }
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

  onSubmit() {
    if (this.addDestinationForm.invalid) {
      this.addDestinationForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.keys(this.addDestinationForm.controls).forEach((key) => {
      formData.append(key, this.addDestinationForm.get(key)?.value);
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
