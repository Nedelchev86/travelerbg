import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root',
})
export class profileUserTypeGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      if (currentUser.user_type === 'traveler') {
        this.router.navigate(['/profile/traveler']);
      } else if (currentUser.user_type === '"BusinessProfile"') {
        this.router.navigate(['/profile/business']);
      }
      return false;
    }
    return true;
  }
}