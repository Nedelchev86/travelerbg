import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('token') ?? '';
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   authService.token.set(token);

//   req = req.clone({
//     setHeaders: {
//       Authorization: token ? `Bearer ${token}` : '',
//     },
//   });
//   return next(req).pipe(
//     catchError((error) => {
//       console.log(error);
//       if (
//         error.status === 401 &&
//         error.error?.detail === 'Given token not valid for any token type'
//       ) {
//         console.log('test2');
//         // Clear the token and log out the user
//         localStorage.removeItem('token');
//         authService.currentUser.set(null);
//         router.navigate(['/']);
//       }
//       return throwError(() => error);
//     })
//   );
// };

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('token') ?? '';
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   const toastr = inject(ToastrService);
//   authService.token.set(token);

//   req = req.clone({
//     setHeaders: {
//       Authorization: token ? `Bearer ${token}` : '',
//     },
//   });

//   return next(req).pipe(
//     catchError((error) => {
//       if (error.status === 401) {
//         if (
//           error.error?.detail === 'Given token not valid for any token type'
//         ) {
//           // Clear the token and log out the user
//           localStorage.removeItem('token');
//           authService.currentUser.set(null);
//           router.navigate(['/']);
//           toastr.error('Session expired. Please log in again.', 'Unauthorized');
//         } else {
//           console.log('Error from auth interceptor:', error);
//         }
//       } else {
//         console.log('Error from auth interceptor: ', error);
//       }
//       return throwError(() => error);
//     })
//   );
// };

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token') ?? '';
  const authService = inject(AuthService);
  const router = inject(Router);
  authService.token.set(token);
  const toastr = inject(ToastrService);

  // req = req.clone({
  //   setHeaders: {
  //     Authorization: token ? `Bearer ${token}` : '',
  //   },
  // });
  // return next(req);
  const isCloudinaryRequest = req.url.includes('cloudinary.com');

  // req = req.clone({
  //   setHeaders: {
  //     Authorization: token ? `Bearer ${token}` : '',
  //   },
  // });

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
        localStorage.removeItem('currentUser');
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
