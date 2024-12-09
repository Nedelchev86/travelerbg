import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../activity-iterface';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [RouterLink, LoaderComponent],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public loading: boolean = false;
  public data: Array<Activity> = [];
  public searchQuery: string = '';
  public categoryQuery: string = '';
  public max_price: number = 0;

  constructor(
    private route: ActivatedRoute,
    private toast: ToastrService,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.searchQuery = params['title'] || '';
        this.categoryQuery = params['category'] || '';
        this.max_price = params['max_price'] ? +params['max_price'] : 0;
        this.fetchActivities();
      });
  }

  ngOnDestroy() {
    console.log('destroy');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchActivities(): void {
    this.loading = true;
    const params: any = {
      title: this.searchQuery,
      category: this.categoryQuery,
      max_price: this.max_price,
    };

    this.activityService
      .fetchActivities(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: Activity[]) => {
          this.data = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch activities', err);
          this.toast.error('Failed to fetch activities');
          this.loading = false;
        },
      });
  }

  // searchActivities(): void {
  //   this.router.navigate([], {
  //     relativeTo: this.route,
  //     queryParams: {
  //       title: this.searchQuery || null,
  //       category: this.categoryQuery || null,
  //       max_price: this.max_price || null,
  //     },
  //     queryParamsHandling: 'merge', // Merge with existing query params
  //   });
  // }
}
