import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hotel-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './hotel-edit.component.html',
  styleUrl: './hotel-edit.component.css',
})
export class HotelEditComponent {
  editHotelForm: FormGroup;
  tags: any[] = []; // This should be populated with your tags
  hotelId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editHotelForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      tags: [[], Validators.required],
      image: [null],
      image2: [null],
      image3: [null],
    });
  }

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('id');
    if (this.hotelId) {
      this.loadHotelData(this.hotelId);
    }

    // Fetch tags from your API
    this.http.get('http://localhost:8000/api/tags/').subscribe((data: any) => {
      this.tags = data;
    });
  }

  loadHotelData(hotelId: string): void {
    this.http
      .get(`http://localhost:8000/api/hotels/${hotelId}/`)
      .subscribe((data: any) => {
        this.editHotelForm.patchValue({
          name: data.name,
          description: data.description,
          location: data.location,
          price: data.price,
          tags: data.tags, // Ensure tags are set correctly
        });
      });
  }

  onFileChange(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.editHotelForm.patchValue({
        [field]: file,
      });
    }
  }

  onTagChange(event: any): void {
    const tagId = parseInt(event.target.value, 10); // Ensure tagId is an integer
    const tagsArray = this.editHotelForm.get('tags')?.value as number[];
    if (event.target.checked) {
      if (!tagsArray.includes(tagId)) {
        tagsArray.push(tagId);
      }
    } else {
      const index = tagsArray.indexOf(tagId);
      if (index > -1) {
        tagsArray.splice(index, 1);
      }
    }
    console.log(tagsArray);
    this.editHotelForm.patchValue({ tags: tagsArray });
  }

  onSubmit(): void {
    if (this.editHotelForm.valid && this.hotelId) {
      const formData = new FormData();
      Object.keys(this.editHotelForm.controls).forEach((key) => {
        if (key === 'tags') {
          const tags = this.editHotelForm
            .get(key)
            ?.value.map((tagId: string) => parseInt(tagId, 10))
            .filter((tagId: number) => !isNaN(tagId)); // Ensure tags are integers and filter out NaN values
          console.log('Transformed Tags:', tags); // Debugging line
          tags.forEach((tag: number) => {
            formData.append('tags', tag.toString());
          });
        } else {
          let controlValue = this.editHotelForm.get(key)?.value;
          if (controlValue === null) {
            controlValue = ''; // Replace null with an empty string
          }
          if (key === 'image' || key === 'image2' || key === 'image3') {
            if (controlValue instanceof File) {
              formData.append(key, controlValue);
            } else if (
              typeof controlValue === 'string' &&
              controlValue !== ''
            ) {
              formData.append(key, controlValue); // Append the existing URL if it's a string and not empty
            }
          } else {
            formData.append(key, controlValue);
          }
        }
        // } else {
        //   const controlValue = this.editHotelForm.get(key)?.value;
        //   if (controlValue instanceof File) {
        //     formData.append(key, controlValue);
        //   } else {
        //     formData.append(key, controlValue);
        //   }
        // }
      });

      // Debugging line to check the FormData content
      for (let pair of (formData as any).entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      this.http
        .put(`http://localhost:8000/api/hotels/${this.hotelId}/`, formData)
        .subscribe((response) => {
          console.log('Hotel updated successfully', response);
          this.router.navigate(['/profile/my-hotels']);
        });
    }
  }
}
