// user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, of, throwError } from 'rxjs';
import { LoginResponse, UserInterface } from './user-interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  public toastr = inject(ToastrService);
  private readonly API_URL = environment.apiUrl;

  login(email: string, password: string): Observable<LoginResponse | null> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}token/`, { email, password })
      .pipe(catchError((error) => this.handleError('Login failed', error)));
  }

  fetchUserData(token: string): Observable<UserInterface | null> {
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<UserInterface>(`${this.API_URL}user/`)
      .pipe(
        catchError((error) =>
          this.handleError('Failed to fetch user data', error)
        )
      );
  }

  register(email: string, password: string, role: string): Observable<any> {
    return this.http
      .post(`${this.API_URL}register/`, { email, password, role })
      .pipe(
        catchError((error) => this.handleError('Registration failed', error))
      );
  }

  private handleError(message: string, error: any): Observable<null> {
    let detail;
    if (
      error?.error?.detail ===
      'No active account found with the given credentials'
    ) {
      detail = 'Invalid email or password';
    } else {
      const detail = error?.error?.detail || 'An error occurred';
    }
    if (
      error?.error?.email &&
      error?.error?.email[0] === 'account with this email already exists.'
    ) {
      detail = 'Account with this email already exists';
    }
    if (
      error?.error?.email &&
      error?.error?.email[0] === 'Enter a valid email address.'
    ) {
      detail = 'Enter a valid email address.';
    }
    this.toastr.error(detail, message);
    return throwError(() => error);
  }
}
