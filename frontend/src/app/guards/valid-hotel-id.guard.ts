import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotelService } from '../services/hotel.service';
import { catchError, map, of } from 'rxjs';

export const validHotelIdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(ToastrService);
  const hotelService = inject(HotelService);

  const hotelId = Number(route.paramMap.get('hotelId'));

  if (isNaN(hotelId) || hotelId <= 0) {
    toast.error('Hotel ID does not exist');
    router.navigate(['/404']);
    return of(false);
  }

  return hotelService.getHotelDetails(hotelId).pipe(
    map(() => true),
    catchError(() => {
      toast.error('Hotel ID does not exist');

      return of(false);
    })
  );
};
