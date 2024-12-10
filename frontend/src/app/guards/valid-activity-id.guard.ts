import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivityService } from '../services/activity.service';
import { catchError, map, of } from 'rxjs';

export const validActivityIdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(ToastrService);
  const activityService = inject(ActivityService);

  const activityId = route.params['activitieId'];

  return activityService.getActivityDetails(activityId).pipe(
    map(() => true),
    catchError(() => {
      toast.error('Activity ID does not exist');
      router.navigate(['/404']);
      return of(false);
    })
  );
};
