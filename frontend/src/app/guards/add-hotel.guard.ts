import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { of } from 'rxjs';

export const addHotelGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastrService);

  const currentUser = authService.currentUser();
  if (currentUser?.user_type === 'BusinessProfile') {
    return true;
  } else {
    toast.error('You are not authorized to add a hotel', 'Access Denied');
    router.navigate(['/']);
    return of(false);
  }
};
