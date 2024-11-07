import { Injectable, signal } from '@angular/core';
import { UserDetails, UserInterface } from './user-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<UserInterface | undefined | null>(undefined);

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
    return this.currentUser() !== null && this.currentUser() !== undefined;
  }
}
