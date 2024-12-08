import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DestinationService } from '../../services/destination.service';
import { Comment } from '../../hotel/hotel-interface';

@Component({
  selector: 'app-destination-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './destination-comments.component.html',
  styleUrl: './destination-comments.component.css',
})
export class DestinationCommentsComponent {
  @Input() destinationId: number | null = null;
  public comments: Comment[] = []; // Store comments data
  public commentForm: FormGroup;
  public commentFormRegistred: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private toast: ToastrService,
    private destinationService: DestinationService
  ) {
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

  ngOnInit(): void {
    if (this.destinationId) {
      this.fetchComments();
    }
  }
  fetchComments(): void {
    this.destinationService.fetchComments(this.destinationId!).subscribe({
      next: (data: Comment[]) => {
        this.comments = data;
      },
      error: (err) => {
        console.error('Failed to fetch comments', err);
        this.toast.error('Failed to fetch comments');
      },
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    const commentData = {
      ...this.commentForm.value,
      destination: this.destinationId,
    };

    this.destinationService
      .addComment(this.destinationId!, commentData)
      .subscribe({
        next: (response) => {
          this.comments.push(response); // Add the new comment to the list
          this.commentForm.reset();
          this.toast.success('Comment added successfully');
        },
        error: (error) => {
          console.error('Error posting comment:', error);
          this.toast.error('Failed to add comment');
        },
      });
  }

  onSubmitRegisteredComment(): void {
    if (this.commentFormRegistred.invalid) {
      this.commentFormRegistred.markAllAsTouched();
      return;
    }

    const commentData = {
      ...this.commentFormRegistred.value,
      destination: this.destinationId,
    };

    this.destinationService
      .addRegisteredComment(this.destinationId!, commentData)
      .subscribe({
        next: (response) => {
          this.comments.push(response); // Add the new comment to the list
          this.commentFormRegistred.reset();
          this.toast.success('Comment added successfully');
        },
        error: (error) => {
          console.error('Error posting comment:', error);
          this.toast.error('Failed to add comment');
        },
      });
  }
}
