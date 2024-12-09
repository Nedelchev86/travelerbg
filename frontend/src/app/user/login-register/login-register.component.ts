import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { passwordMatchValidator } from '../../validators/password-match.validator';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
})
export class LoginRegisterComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public selectedTab: string = 'login';
  public loading: boolean = false;
  public loginError: string | null = null;
  public registerError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public toast: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirm_password: ['', Validators.required],
        role: ['', Validators.required],
      },
      { validator: passwordMatchValidator }
    );
  }

  closeModal() {
    this.close.emit();
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.loginError = null;
    });

    this.registerForm.valueChanges.subscribe(() => {
      this.registerError = null;
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

    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Registration successful');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        if (err.status === 400 && err.error && err.error.email) {
          this.registerError = 'Account with this email already exists.';
        } else {
          this.registerError = 'Failed to register. Please try again.';
        }
        this.toast.error(this.registerError!);
      },
    });
  }

  // onRegisterSubmit(): void {
  //   if (this.registerForm.invalid) {
  //     this.registerForm.markAllAsTouched();
  //     return;
  //   }

  //   this.authService.register(
  //     this.registerForm.value as {
  //       email: string;
  //       password: string;
  //       confirm_password: string;
  //       role: string;
  //     }
  //   );
  // }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Login successful');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.loginError = 'Failed to login. Wrong email or password.';
        this.toast.error('Login failed. Wrong email or password');
      },
    });
  }

  // onLoginSubmit(): void {
  //   if (this.loginForm.invalid) {
  //     this.loginForm.markAllAsTouched();
  //     return;
  //   }

  //   this.authService.login(
  //     this.loginForm.value as { email: string; password: string }
  //   );
  // }
}
