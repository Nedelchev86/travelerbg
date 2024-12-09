import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HotelService } from '../../services/hotel.service';
import { Comment } from '../hotel-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hotel-comments.component.html',
  styleUrl: './hotel-comments.component.css',
})
export class HotelCommentsComponent implements OnInit {
  @Input() hotelId: number | null = null;

  public comments: Comment[] = []; // Store comments data
  public commentForm: FormGroup;
  public commentFormRegistred: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private toast: ToastrService,
    private hotelDetailsService: HotelService
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
    if (this.hotelId) {
      this.fetchComments();
    }
  }

  fetchComments(): void {
    this.hotelDetailsService.fetchComments(this.hotelId!).subscribe({
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
      hotel: this.hotelId,
    };

    this.hotelDetailsService.addComment(this.hotelId!, commentData).subscribe({
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
      hotel: this.hotelId,
    };

    this.hotelDetailsService
      .addRegisteredComment(this.hotelId!, commentData)
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
