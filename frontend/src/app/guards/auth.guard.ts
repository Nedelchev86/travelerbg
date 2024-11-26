import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Adjust the path as necessary
import { Toast, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  toastr = inject(ToastrService);

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.toastr.error('Access Denied', 'You are not logged in', {
        positionClass: 'toast-bottom-right',
        progressBar: true,
        timeOut: 5000,
        progressAnimation: 'decreasing',
        closeButton: true,
      });
      this.router.navigate(['']); // Redirect to the login page if not logged in
      return false;
    }
  }
}
