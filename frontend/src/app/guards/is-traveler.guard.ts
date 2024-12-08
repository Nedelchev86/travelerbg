import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { of } from 'rxjs';

export const isTravelerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastrService);

  const currentUser = authService.currentUser();
  console.log(currentUser);
  if (currentUser?.user_type === 'traveler') {
    return true;
  } else {
    toast.error('You are not authorized to add a destination', 'Access Denied');
    router.navigate(['/']);
    return of(false);
  }
};
