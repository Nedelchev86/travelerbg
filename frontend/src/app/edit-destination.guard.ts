import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of } from 'rxjs';
import { environment } from '../environments/environment';

export const editDestinationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const http = inject(HttpClient);
  const router = inject(Router);
  const toast = inject(ToastrService);
  const API_URL = environment.apiUrl;

  const destinationId = route.paramMap.get('id');
  if (!destinationId) {
    router.navigate(['/']);
    return of(false);
  }

  return http.get<any>(`${API_URL}destinations/${destinationId}`).pipe(
    map((destination) => {
      const currentUser = authService.currentUser();
      console.log('currentUser', currentUser);
      console.log('destination', destination);
      if (destination.user === currentUser?.user.user) {
        return true;
      } else {
        toast.error(
          'You are not authorized to edit this destination',
          'Access Denied'
        );
        router.navigate(['/']);
        return false;
      }
    }),
    catchError((error) => {
      toast.error('Destination not found', 'Access Denied');
      router.navigate(['/']);
      return of(false);
    })
  );
};
