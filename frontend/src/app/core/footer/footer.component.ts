import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  subscribeForm!: FormGroup;

  ngOnInit(): void {
    this.subscribeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.subscribeForm.invalid) {
      this.subscribeForm.markAllAsTouched();
      return;
    }
    const email = this.subscribeForm.value.email;
    // Handle the subscription logic here
    this.toastr.success(`Subscribed with email: ${email}`);
  }
}
