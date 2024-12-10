import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TravelerService } from '../services/traveler.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const validTravelerIdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(ToastrService);
  const travelerService = inject(TravelerService);

  const travelerId = route.params['travelerId'];

  return travelerService.getTraveler(travelerId).pipe(
    map(() => true),
    catchError(() => {
      toast.error('Traveler ID does not exist');
      router.navigate(['/404']);
      return of(false);
    })
  );
};
