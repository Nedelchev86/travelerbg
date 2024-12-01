import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token') ?? '';
  const authService = inject(AuthService);
  const router = inject(Router);
  authService.token.set(token);
  const toastr = inject(ToastrService);

  const isCloudinaryRequest = req.url.includes('cloudinary.com');

  if (!isCloudinaryRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
  }
  return next(req).pipe(
    catchError((error) => {
      console.log('error', error);
      if (
        error.status === 401 &&
        error.error?.detail === 'Given token not valid for any token type'
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        authService.currentUser.set(null);
        authService.token.set(null);
        router.navigate(['/']);
        toastr.error(
          'Token expired or invalid. Please log in again.',
          'Unauthorized'
        );
      }
      return throwError(() => error);
    })
  );
};
