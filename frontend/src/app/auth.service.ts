import { inject, Injectable, signal } from '@angular/core';
import { UserDetails, UserInterface } from './user-interface';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //   currentUser = signal<UserInterface | undefined | null>(undefined);
  //   token = signal<string | null>(null);
  //   private tokenKey = 'token';
  //   private http = inject(HttpClient);

  //   private readonly API_URL = environment.apiUrl;

  //   updateToken(token: string): void {
  //     localStorage.setItem(this.tokenKey, token);
  //   }

  //   fetchUserData() {
  //     return this.http
  //       .get<UserInterface>(`${this.API_URL}user/`)
  //       .pipe(
  //         catchError((error) => {
  //           this.handleError('Failed to fetch user data', error);
  //           return of(null); // Return null in case of error
  //         })
  //       )
  //       .subscribe((userData) => {
  //         console.log('userData', userData);
  //         if (userData) {
  //           this.currentUser.set(userData);
  //         }
  //       });
  //   }

  //   handleError(arg0: string, error: any): any {
  //     throw new Error('Method not implemented.');
  //   }

  //   updateCurrentUser(user: UserInterface): void {
  //     this.currentUser.set(user);
  //   }

  //   updateUserDetails(userDetails: UserDetails): void {
  //     const currentUser = this.currentUser();
  //     if (currentUser) {
  //       const updatedUser: UserInterface = {
  //         ...currentUser,
  //         user: userDetails,
  //       };
  //       this.currentUser.set(updatedUser);
  //     }
  //   }

  //   isLoggedIn(): boolean {
  //     return (
  //       this.token() !== null && this.token() !== undefined && this.token() !== ''
  //     );

  //     // return this.currentUser() !== null && this.currentUser() !== undefined;
  //   }
  //   isTraveler(): boolean {
  //     console.log('test', this.currentUser());
  //     return this.currentUser()?.user_type === 'traveler';
  //   }

  //   isActivated(): boolean {
  //     console.log('USER', this.currentUser()?.user);
  //     return this.currentUser()?.user.activated === true;
  //   }

  //   logout(): void {
  //     this.currentUser.set(null);
  //     this.token.set(null);
  //     localStorage.removeItem('currentUser');
  //   }
  // }
  private readonly API_URL = environment.apiUrl; // Update with your Django REST API base URL

  // Signals for authentication state
  public token = signal<string | null>(null);
  public currentUser = signal<any | null>(null);
  private toast = inject(ToastrService);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromLocalStorage();
  }

  /**
   * Load token and user info from localStorage on initialization
   */
  private loadFromLocalStorage(): void {
    const savedToken = localStorage.getItem('token');
    const savedUserInfo = localStorage.getItem('user');

    if (savedToken) {
      this.token.set(savedToken);
    }

    if (savedUserInfo) {
      this.currentUser.set(JSON.parse(savedUserInfo));
    }
  }

  /**
   * Log in the user and store token and user info
   * @param credentials - login credentials
   */
  login(credentials: { email: string; password: string }): void {
    this.http.post(`${this.API_URL}token/`, credentials).subscribe({
      next: (response: any) => {
        const token = response.access;
        this.token.set(token);

        localStorage.setItem('token', token);
        this.fetchUserData();

        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.error('Login failed. Wronag email or password');

        // Handle error (e.g., show a message)
      },
    });
  }
  register(userDetails: {
    email: string;
    password: string;
    confirm_password: string;
    role: string;
  }): void {
    this.http.post(`${this.API_URL}register/`, userDetails).subscribe({
      next: (response: any) => {
        this.login(userDetails);

        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.error('Email already exists', 'Try again');

        // Handle error (e.g., show a message)
      },
    });
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  /**
   * Get the current user information
   */
  getCurrentUser(): any {
    return this.currentUser();
  }

  /**
   * Fetch user details (e.g., after a login or token refresh)
   */
  fetchUserData(): void {
    if (!this.token()) return;

    this.http.get(`${this.API_URL}user/`).subscribe({
      next: (user: any) => {
        this.currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (err) => {
        console.error('Failed to fetch user details:', err);
        this.logout(); // Optionally log out the user on error
      },
    });
  }
}
