import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-site-count',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './site-count.component.html',
  styleUrl: './site-count.component.css',
})
export class SiteCountComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public destinationsCount: number = 0;
  public hotelsCount: number = 0;
  public activitiesCount: number = 0;
  public travelersCount: number = 0;
  public loading: boolean = false;
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCounts();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchCounts(): void {
    this.loading = true;
    const destinationsCount$ = this.http.get<{ count: number }>(
      `${this.API_URL}destinations/count/`
    );
    const hotelsCount$ = this.http.get<{ count: number }>(
      `${this.API_URL}hotels/count/`
    );
    const activitiesCount$ = this.http.get<{ count: number }>(
      `${this.API_URL}activities/count/`
    );
    const usersCount$ = this.http.get<{ count: number }>(
      `${this.API_URL}travelers/count/`
    );

    forkJoin([destinationsCount$, hotelsCount$, activitiesCount$, usersCount$])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ([destinations, hotels, activities, users]) => {
          this.loading = false;
          this.destinationsCount = destinations.count;
          this.hotelsCount = hotels.count;
          this.activitiesCount = activities.count;
          this.travelersCount = users.count;
        },
        error: (err) => {
          this.loading = false;
          console.error('Failed to fetch counts', err);
        },
      });
  }
}
