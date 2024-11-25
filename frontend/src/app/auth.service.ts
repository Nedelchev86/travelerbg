import { inject, Injectable, signal } from '@angular/core';
import { UserDetails, UserInterface } from './user-interface';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<UserInterface | undefined | null>(undefined);
  token = signal<string | null>(null);
  private tokenKey = 'token';
  private http = inject(HttpClient);

  private readonly API_URL = environment.apiUrl;

  updateToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  fetchUserData() {
    return this.http
      .get<UserInterface>(`${this.API_URL}user/`)
      .pipe(
        catchError((error) => {
          this.handleError('Failed to fetch user data', error);
          return of(null); // Return null in case of error
        })
      )
      .subscribe((userData) => {
        console.log('userData', userData);
        if (userData) {
          this.currentUser.set(userData);
        }
      });
  }

  handleError(arg0: string, error: any): any {
    throw new Error('Method not implemented.');
  }

  updateCurrentUser(user: UserInterface): void {
    this.currentUser.set(user);
  }

  updateUserDetails(userDetails: UserDetails): void {
    const currentUser = this.currentUser();
    if (currentUser) {
      const updatedUser: UserInterface = {
        ...currentUser,
        user: userDetails,
      };
      this.currentUser.set(updatedUser);
    }
  }

  isLoggedIn(): boolean {
    return (
      this.token() !== null && this.token() !== undefined && this.token() !== ''
    );

    // return this.currentUser() !== null && this.currentUser() !== undefined;
  }
  isTraveler(): boolean {
    console.log('test', this.currentUser());
    return this.currentUser()?.user_type === 'traveler';
  }

  isActivated(): boolean {
    console.log('USER', this.currentUser()?.user);
    return this.currentUser()?.user.activated === true;
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('currentUser');
  }
}
