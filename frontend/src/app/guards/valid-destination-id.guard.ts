import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DestinationService } from '../services/destination.service';
import { catchError, map, of } from 'rxjs';

export const validDestinationIdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(ToastrService);
  const destinationService = inject(DestinationService);

  const destinationId = route.params['destinationId'];

  return destinationService.fetchDestinationDetails(destinationId).pipe(
    map(() => true),
    catchError(() => {
      toast.error('Destination ID does not exist');
      router.navigate(['/404']);
      return of(false);
    })
  );
};
