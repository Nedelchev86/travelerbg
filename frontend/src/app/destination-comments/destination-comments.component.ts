import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-destination-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './destination-comments.component.html',
  styleUrl: './destination-comments.component.css',
})
export class DestinationCommentsComponent {
  @Input() destinationId: string | null = null;
  comments: any[] = []; // Store comments data
  commentForm: FormGroup;
  commentFormRegistred: FormGroup;
  constructor() {
    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      text: ['', Validators.required],
    });

    this.commentFormRegistred = this.fb.group({
      text: ['', Validators.required],
    });
  }
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private toast = inject(ToastrService);
  private readonly API_URL = environment.apiUrl;

  ngOnInit(): void {
    console.log('Destination ID:', this.destinationId);
    if (this.destinationId) {
      this.fetcComments(this.destinationId);
    }
  }

  fetcComments(destinationId: string): void {
    this.http
      .get(`${this.API_URL}destinations/${destinationId}/comments/`)
      .subscribe(
        (response: any) => {
          this.comments = response;
          console.log(this.comments);
        },
        (error) => {
          console.error('Error fetching comments details:', error);
        }
      );
  }

  onSubmitComment(): void {
    if (this.commentForm.valid) {
      const commentData = {
        ...this.commentForm.value,
        destination: this.destinationId,
      };
      this.http
        .post(
          `${this.API_URL}destinations/${this.destinationId}/comments/add/`,
          commentData
        )
        .subscribe(
          (response) => {
            console.log('Comment posted successfully', response);
            this.comments.push(response); // Add the new comment to the list
            this.commentForm.reset();
          },
          (error) => {
            console.error('Error posting comment:', error);
          }
        );
    } else {
      console.log('Invalid form');
      this.commentForm.markAllAsTouched();
    }
  }

  onSubmitRegistredComment(): void {
    if (this.commentFormRegistred.valid) {
      const commentData = {
        ...this.commentFormRegistred.value,
        destination: this.destinationId,
      };
      this.http
        .post(
          `${this.API_URL}destinations/${this.destinationId}/comments/add/`,
          commentData
        )
        .subscribe(
          (response) => {
            console.log('Comment posted successfully', response);
            this.comments.push(response); // Add the new comment to the list
            this.commentFormRegistred.reset();
          },
          (error) => {
            console.error('Error posting comment:', error);
          }
        );
    } else {
      console.log('Invalid form');
      this.commentFormRegistred.markAllAsTouched();
    }
  }
}
