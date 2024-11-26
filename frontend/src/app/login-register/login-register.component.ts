// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Component, inject } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { LoginResponse, UserInterface } from '../user-interface';
// import { catchError, of, switchMap } from 'rxjs';
// import { AuthService } from '../auth.service';
// import { passwordMatchValidator } from '../validators/password-match.validator';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-login-register',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   providers: [ToastrService],
//   templateUrl: './login-register.component.html',
//   styleUrl: './login-register.component.css',
// })
// export class LoginRegisterComponent {
//   registerError: string | null = null;
//   loginError: string | null = null;
//   fb = inject(FormBuilder);
//   http = inject(HttpClient);
//   authService = inject(AuthService);
//   toastr = inject(ToastrService);
//   // constructor(private fb: FormBuilder) {
//   loginForm = this.fb.group({
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', [Validators.required]],
//     // password: ['', [Validators.required, Validators.minLength(6)]],
//   });
//   selectedTab: string = 'login';

//   registerForm = this.fb.group(
//     {
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       confirm_password: ['', Validators.required],
//       role: ['', Validators.required],
//     },
//     { validators: passwordMatchValidator }
//   );
//   selectTab(tab: string): void {
//     this.selectedTab = tab;
//   }

//   onLoginSubmit(): void {
//     if (this.loginForm.valid) {
//       this.http
//         .post<{ access: string }>('http://localhost:8000/api/token/', {
//           email: this.loginForm.value.email,
//           password: this.loginForm.value.password,
//         })
//         .pipe(
//           switchMap((response) => {
//             console.log(response);
//             localStorage.setItem('token', response.access);
//             const headers = new HttpHeaders().set(
//               'Authorization',
//               `Bearer ${response.access}`
//             );
//             return this.http.get('http://localhost:8000/api/user/', {
//               headers,
//             });
//           }),
//           catchError((error) => {
//             console.error('Login failed2', error);
//             if (error.status === 401 && error.error) {
//               this.loginError = error.error.detail
//                 ? error.error.detail
//                 : 'Login failed3';
//             } else {
//               this.loginError = 'Login failed5';
//             }
//             console.error('Failed to fetch user data', error);
//             return of(null); // Return a null observable to handle the error gracefully
//           })
//         )
//         .subscribe(
//           (user) => {
//             if (user) {
//               console.log('User data:', user);
//               this.authService.currentUser.set(user as UserInterface);
//               console.log(
//                 'User data from auth:',
//                 this.authService.currentUser()
//               );
//               console.log('test');
//               this.toastr.success('Login successful', 'Welcome!', {
//                 positionClass: 'toast-bottom-right',
//                 progressBar: true,
//                 timeOut: 5000,
//                 progressAnimation: 'decreasing',
//                 closeButton: true,
//               });

//               // Handle user data here
//             }
//           },
//           (error) => {
//             console.error('Login failed', error);
//             if (error.status === 401 && error.error) {
//               this.registerError = error.error.detail
//                 ? error.error.detail[0]
//                 : 'Login failed';
//             } else {
//               this.loginError = 'Login failed';
//             }
//             console.error('Failed to fetch user data', error);
//           }
//         );
//     }
//   }
//   onRegisterSubmit(): void {
//     if (this.registerForm.valid) {
//       this.http
//         .post('http://localhost:8000/api/register/', {
//           email: this.registerForm.value.email,
//           password: this.registerForm.value.password,
//           role: this.registerForm.value.role,
//         })
//         .subscribe(
//           (response) => {
//             console.log('Register form submitted', response);
//             this.registerError = null;
//             this.selectTab('login');
//           },
//           (error) => {
//             console.error('Registration failed', error);
//             if (error.status === 400 && error.error) {
//               this.registerError = error.error.email
//                 ? error.error.email[0]
//                 : 'Registration failed';
//             } else {
//               this.registerError = 'Registration failed';
//             }
//           }
//         );
//     }
//   }
// }

import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

import { passwordMatchValidator } from '../validators/password-match.validator';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

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

  // onLoginSubmit(): void {
  //   if (this.loginForm.valid) {
  //     const { email, password } = this.loginForm.value;
  //     this.userService.login(email!, password!).subscribe({
  //       next: (response) => {
  //         // Handle successful login response
  //         if (response?.access) {
  //           localStorage.setItem('token', response.access);

  //           this.userService
  //             .fetchUserData(response.access)
  //             .subscribe((user) => {
  //               if (user) {
  //                 this.authService.updateCurrentUser(user);
  //                 localStorage.setItem('currentUser', JSON.stringify(user));
  //                 this.toastr.success('Login successful', 'Welcome!');
  //               }
  //             });
  //         }
  //       },
  //       error: (error) => {
  //         // Handle the 401 error and prevent it from being logged in the console
  //         if (error.status === 401) {
  //           this.loginError = 'Invalid email or password.';
  //           // this.toastr.error(this.loginError, 'Login failed');
  //         } else {
  //           // Handle other errors, maybe display a different message
  //           this.toastr.error(
  //             'An error occurred. Please try again later.',
  //             'Login failed'
  //           );
  //         }
  //       },
  //     });
  //   }
  // }

  // onLoginSubmit(): void {
  //   if (this.loginForm.valid) {
  //     const { email, password } = this.loginForm.value;
  //     this.userService.login(email!, password!).subscribe({
  //       next: (response) => {
  //         // Handle successful login response
  //         if (response?.access) {
  //           localStorage.setItem('token', response.access);
  //           this.userService
  //             .fetchUserData(response.access)
  //             .subscribe((user) => {
  //               if (user) {
  //                 this.authService.updateCurrentUser(user);
  //                 this.showToast('Login successful', 'Welcome!');
  //               }
  //             });
  //         }
  //       },
  //       error: (error) => {
  //         // Handle the 401 error and prevent it from being logged in the console
  //         if (error.status === 401) {
  //           this.loginError = 'Invalid login credentials. Please try again.';
  //           this.userService.toastr.error(this.loginError, 'Login failed');
  //         } else {
  //           // Handle other errors, maybe display a different message
  //           this.userService.toastr.error(
  //             'An error occurred. Please try again later.',
  //             'Login failed'
  //           );
  //         }
  //       },
  //     });
  //   }
  // }

  // onRegisterSubmit(): void {
  //   if (this.registerForm.valid) {
  //     const { email, password, role } = this.registerForm.value;
  //     this.userService
  //       .register(email!, password!, role!)
  //       .subscribe((response) => {
  //         if (response) {
  //           this.registerError = null;
  //           this.registerForm.reset();
  //           this.selectTab('login');
  //           this.showToast(
  //             'Registration successful',
  //             'Please login in your account!'
  //           );
  //         } else {
  //           this.registerError = 'Account with this email already exists.';
  //         }
  //       });
  //   }
  // }

  // onRegisterSubmit(): void {
  //   if (this.registerForm.valid) {
  //     const { email, password, role } = this.registerForm.value;

  //     this.userService.register(email!, password!, role!).subscribe({
  //       next: (response) => {
  //         if (response) {
  //           this.registerError = null;
  //           this.userService.login(email!, password!).subscribe({
  //             next: (loginResponse) => {
  //               if (loginResponse?.access) {
  //                 // Store the token and update current user data
  //                 localStorage.setItem('token', loginResponse.access);
  //                 this.userService
  //                   .fetchUserData(loginResponse.access)
  //                   .subscribe((user) => {
  //                     if (user) {
  //                       this.authService.updateCurrentUser(user);
  //                       localStorage.setItem(
  //                         'currentUser',
  //                         JSON.stringify(user)
  //                       );
  //                       this.showToast(
  //                         'Registration and login successful',
  //                         'Welcome!'
  //                       );

  //                       // Reset the registration form
  //                       this.registerForm.reset();
  //                     }
  //                   });
  //               } else {
  //                 console.log('1');
  //                 this.registerError = 'Login failed after registration.';
  //               }
  //             },
  //             error: () => {
  //               console.log('2');
  //               this.registerError = 'Login failed after registration.';
  //             },
  //           });
  //         } else {
  //           console.log('3');
  //           this.registerError = 'Account with this email already exists.';
  //         }
  //       },
  //       error: (error) => {
  //         if (
  //           error.status === 400 &&
  //           error.error.email[0] === 'Enter a valid email address.'
  //         ) {
  //           console.log('Enter a valid email address.');
  //           this.registerError = 'Enter a valid email address.';
  //         } else {
  //           console.log('Registration failed / From Login Component', error);
  //           this.registerError = 'Account with this email already exists.';
  //         }
  //       },
  //     });
  //   }
  // }

  // private showToast(title: string, message: string) {
  //   this.userService.toastr.success(message, title, {
  //     positionClass: 'toast-bottom-right',
  //     progressBar: true,
  //     timeOut: 5000,
  //     progressAnimation: 'decreasing',
  //     closeButton: true,
  //   });
  // }

  onRegisterSubmit(): void {
    console.log(this.registerForm.valid);
    if (this.registerForm.valid) {
      this.authService.register(
        this.registerForm.value as {
          email: string;
          password: string;
          confirm_password: string;
          role: string;
        }
      );
    }
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(
        this.loginForm.value as { email: string; password: string }
      );
    }
  }
}
