import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

export const isActivatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const currentUser = authService.currentUser()?.user.activated;
  console.log(currentUser);
  if (currentUser) {
    return true;
  } else {
    toastr.error(
      'Your account is not activated. Please go to "Edit Profile',
      'Access Denied'
    );
    router.navigate(['/profile']);
    return false;
  }
};
