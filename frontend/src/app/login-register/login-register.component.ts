import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginResponse, UserInterface } from '../user-interface';
import { catchError, of, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ToastrService],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css',
})
export class LoginRegisterComponent {
  registerError: string | null = null;
  loginError: string | null = null;
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  // constructor(private fb: FormBuilder) {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    // password: ['', [Validators.required, Validators.minLength(6)]],
  });
  selectedTab: string = 'login';

  registerForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      role: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      this.http
        .post<{ access: string }>('http://localhost:8000/api/token/', {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
        })
        .pipe(
          switchMap((response) => {
            console.log(response);
            localStorage.setItem('token', response.access);
            const headers = new HttpHeaders().set(
              'Authorization',
              `Bearer ${response.access}`
            );
            return this.http.get('http://localhost:8000/api/user/', {
              headers,
            });
          }),
          catchError((error) => {
            console.error('Login failed2', error);
            if (error.status === 401 && error.error) {
              this.loginError = error.error.detail
                ? error.error.detail
                : 'Login failed3';
            } else {
              this.loginError = 'Login failed5';
            }
            console.error('Failed to fetch user data', error);
            return of(null); // Return a null observable to handle the error gracefully
          })
        )
        .subscribe(
          (user) => {
            if (user) {
              console.log('User data:', user);
              this.authService.currentUser.set(user as UserInterface);
              console.log(
                'User data from auth:',
                this.authService.currentUser()
              );
              console.log('test');
              this.toastr.success('Login successful', 'Welcome!', {
                positionClass: 'toast-bottom-right',
                progressBar: true,
                timeOut: 5000,
                progressAnimation: 'decreasing',
                closeButton: true,
              });

              // Handle user data here
            }
          },
          (error) => {
            console.error('Login failed', error);
            if (error.status === 401 && error.error) {
              this.registerError = error.error.detail
                ? error.error.detail[0]
                : 'Login failed';
            } else {
              this.loginError = 'Login failed';
            }
            console.error('Failed to fetch user data', error);
          }
        );
    }
  }
  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      this.http
        .post('http://localhost:8000/api/register/', {
          email: this.registerForm.value.email,
          password: this.registerForm.value.password,
          role: this.registerForm.value.role,
        })
        .subscribe(
          (response) => {
            console.log('Register form submitted', response);
            this.registerError = null;
            this.selectTab('login');
          },
          (error) => {
            console.error('Registration failed', error);
            if (error.status === 400 && error.error) {
              this.registerError = error.error.email
                ? error.error.email[0]
                : 'Registration failed';
            } else {
              this.registerError = 'Registration failed';
            }
          }
        );
    }
  }
}
