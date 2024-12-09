import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { AuthService } from '../../services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { DestinationService } from '../../services/destination.service';
import { ApiResponse, Destination } from '../destination-interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [RouterLink, FormsModule, LoaderComponent, RatingComponent],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate(
          '500ms ease-in',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class DestinationsComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  public destinations: Destination[] = [];
  public searchQuery: string = '';
  public categoryQuery: string = '';
  public currentPage: number = 1;
  public totalPages: number = 1;
  public nextPageUrl: string | null = null;
  public previousPageUrl: string | null = null;
  public loading = true;

  constructor(
    private destinationsService: DestinationService,
    private authService: AuthService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.categoryQuery = params['category'] || '';
        this.fetchDestinations();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchDestinations(): void {
    this.loading = true;
    this.destinationsService
      .fetchDestinations(this.currentPage, this.searchQuery, this.categoryQuery)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: ApiResponse) => {
          this.destinations = data.results;
          this.totalPages = Math.ceil(data.count / 9);
          this.nextPageUrl = data.next;
          this.previousPageUrl = data.previous;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Failed to fetch destinations');
          this.loading = false;
        },
      });
  }

  searchDestinations(): void {
    this.currentPage = 1;
    this.fetchDestinations();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateQueryParams();
    }
  }

  updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
        category: this.categoryQuery || null,
        title: this.searchQuery || null,
      },
      queryParamsHandling: 'merge', // Merge with existing query params
    });
  }

  getPaginationArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  updateDestinationRating(destinationId: number): void {
    this.destinationsService.fetchDestinationDetails(destinationId).subscribe({
      next: (data) => {
        const destination = this.destinations.find(
          (d) => d.id === destinationId
        );
        if (destination) {
          destination.average_rating = data.average_rating;
          destination.number_of_votes = data.number_of_votes;
        }
      },
      error: (err) => {
        console.error(err);
        this.toast.error(
          'Error fetching destination rating',
          'Cannot connect to server'
        );
      },
    });
  }

  rateDestination(destinationId: number, rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate destinations', 'Login required');
      return;
    }

    this.destinationsService.rateDestination(destinationId, rating).subscribe({
      next: () => {
        this.updateDestinationRating(destinationId);
        this.toast.success('Rating submitted successfully');
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Failed to submit rating', 'Error');
      },
    });
  }
}
