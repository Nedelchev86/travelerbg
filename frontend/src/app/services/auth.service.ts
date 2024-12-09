import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  public token = signal<string | null>(null);
  public currentUser = signal<any | null>(null);
  private toast = inject(ToastrService);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromLocalStorage();
  }

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

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}token/`, credentials).pipe(
      tap((response: any) => {
        const token = response.access;
        this.token.set(token);
        localStorage.setItem('token', token);
        this.fetchUserData();
      })
    );
  }

  // login(credentials: { email: string; password: string }): void {
  //   this.http.post(`${this.API_URL}token/`, credentials).subscribe({
  //     next: (response: any) => {
  //       const token = response.access;
  //       this.token.set(token);

  //       localStorage.setItem('token', token);
  //       this.fetchUserData();

  //       this.router.navigate(['/']);
  //     },
  //     error: (err) => {
  //       this.toast.error('Login failed. Wronag email or password');
  //     },
  //   });
  // }

  register(userDetails: {
    email: string;
    password: string;
    confirm_password: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}register/`, userDetails).pipe(
      tap((response: any) => {
        this.login({
          email: userDetails.email,
          password: userDetails.password,
        }).subscribe();
      })
    );
  }

  // register(userDetails: {
  //   email: string;
  //   password: string;
  //   confirm_password: string;
  //   role: string;
  // }): void {
  //   this.http.post(`${this.API_URL}register/`, userDetails).subscribe({
  //     next: (response: any) => {
  //       this.login(userDetails);

  //       this.router.navigate(['/']);
  //     },
  //     error: (err) => {
  //       this.toast.error('Email already exists', 'Try again');

  //       // Handle error (e.g., show a message)
  //     },
  //   });
  // }

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

  getCurrentUser(): any {
    return this.currentUser();
  }

  fetchUserData(): void {
    if (!this.token()) return;

    this.http.get(`${this.API_URL}user/`).subscribe({
      next: (user: any) => {
        this.currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (err) => {
        console.error('Failed to fetch user details:', err);
        this.logout(); 
      },
    });
  }

  deleteUser(): Observable<any> {
    return this.http.delete(`${this.API_URL}user/`);
  }

  getBookmarks(userType: string, userId: number): Observable<any> {
    return this.http.get(`${this.API_URL}${userType}/${userId}/favorites/`);
  }

  removeFavorite(type: string, id: number): Observable<any> {
    return this.http.delete(
      `${this.API_URL}${type}/${id}/remove_from_favorites/`
    );
  }
}
