import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { passwordMatchValidator } from '../../validators/password-match.validator';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
})
export class LoginRegisterComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  loginError: string | null = null;
  registerError: string | null = null;
  selectedTab = 'login';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  registerForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      role: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );
  closeModal() {
    this.close.emit();
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.loginError = null; // Clear the error message when the user starts typing
    });

    this.registerForm.valueChanges.subscribe(() => {
      this.registerError = null; // Clear the error message when the user starts typing
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(
      this.registerForm.value as {
        email: string;
        password: string;
        confirm_password: string;
        role: string;
      }
    );
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(
      this.loginForm.value as { email: string; password: string }
    );
  }
}
