import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of } from 'rxjs';
export const editHotelGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const http = inject(HttpClient);
  const router = inject(Router);
  const toast = inject(ToastrService);

  const hotelId = route.paramMap.get('id');
  if (!hotelId) {
    router.navigate(['/']);
    return of(false);
  }

  return http.get<any>(`http://localhost:8000/api/hotels/${hotelId}`).pipe(
    map((hotel) => {
      const currentUser = authService.currentUser();

      if (hotel.user === currentUser?.user.user) {
        return true;
      } else {
        toast.error(
          'You are not authorized to edit this hotel',
          'Access Denied'
        );
        router.navigate(['/']);
        return false;
      }
    }),
    catchError((error) => {
      toast.error('Hotel not found', 'Access Denied');
      router.navigate(['/']);
      return of(false);
    })
  );
};
