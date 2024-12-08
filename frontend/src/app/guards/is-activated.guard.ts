import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const isActivatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const currentUser = authService.currentUser()?.user.activated;
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
