import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of } from 'rxjs';

export const editActivitiesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const http = inject(HttpClient);
  const router = inject(Router);
  const toast = inject(ToastrService);

  const activitiesId = route.paramMap.get('id');
  if (!activitiesId) {
    router.navigate(['/']);
    return of(false);
  }

  return http
    .get<any>(`http://localhost:8000/api/activities/${activitiesId}`)
    .pipe(
      map((activitie) => {
        const currentUser = authService.currentUser();

        if (activitie.user === currentUser?.user.user) {
          return true;
        } else {
          toast.error(
            'You are not authorized to edit this activitie',
            'Access Denied'
          );
          router.navigate(['/']);
          return false;
        }
      }),
      catchError((error) => {
        toast.error('Activitie not found', 'Access Denied');
        router.navigate(['/']);
        return of(false);
      })
    );
};
