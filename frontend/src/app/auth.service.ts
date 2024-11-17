import { Injectable, signal } from '@angular/core';
import { UserDetails, UserInterface } from './user-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<UserInterface | undefined | null>(undefined);
  token = signal<string | null>(null);
  private tokenKey = 'token';

  updateToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
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

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('currentUser');
  }
}
