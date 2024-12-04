import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';

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
export class DestinationsComponent {
  httpClient = inject(HttpClient);
  authService = inject(AuthService);
  public data: Array<any> = [];
  public searchQuery: string = '';
  public categoryQuery: string = '';
  public currentPage: number = 1;
  public totalPages: number = 1;
  public nextPageUrl: string | null = null;
  public previousPageUrl: string | null = null;
  private readonly API_URL = environment.apiUrl;
  loading = true;
  searching = false;
  route = inject(ActivatedRoute);
  router = inject(Router);
  toast = inject(ToastrService);
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.categoryQuery = params['category'] || '';
      this.fetchDestinations();
    });
  }

  fetchDestinations(url: string = `${this.API_URL}destinations/`): void {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
    };
    if (this.searchQuery) {
      params.title = this.searchQuery;
    }
    if (this.categoryQuery) {
      params.category = this.categoryQuery;
    }
    // Check if the URL already contains query parameters
    const hasQueryParams = url.includes('?');

    this.httpClient
      .get(url, { params: hasQueryParams ? {} : params })
      .subscribe({
        next: (data: any) => {
          this.data = data.results;
          this.totalPages = Math.ceil(data.count / 9); // Assuming 9 items per page
          this.nextPageUrl = data.next;
          this.previousPageUrl = data.previous;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

  searchDestinations(): void {
    // this.searching = true;
    const params = {
      title: this.searchQuery,
      category: this.categoryQuery,
    };
    this.currentPage = 1;

    this.httpClient.get(`${this.API_URL}destinations/`, { params }).subscribe({
      next: (data: any) => {
        this.data = data.results;
        // this.searching = false;
      },
      error: (err) => {
        console.log(err);
        // this.searching = false;
      },
    });
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

  updateDestinationRating(destinationId: string): void {
    const destination = this.data.find((t) => t.id === destinationId);
    if (destination) {
      this.httpClient
        .get(`${this.API_URL}destinations/${destinationId}`)
        .subscribe({
          next: (data: any) => {
            destination.average_rating = data.average_rating;
            destination.number_of_votes = data.number_of_votes;
          },
          error: (err) => {
            console.log(err);
            this.toast.error(
              'Error fetching travelers data',
              'Cannot connect to server'
            );
          },
        });
    }
  }

  rateDestination(destinationId: string, rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate travelers', 'Login required');
      return;
    }

    this.httpClient
      .post(`${this.API_URL}destinations/${destinationId}/rate/`, {
        rating,
      })
      .subscribe({
        next: (response) => {
          this.updateDestinationRating(destinationId);
          this.toast.success('Rating submitted successfully');
        },
        error: (err) => {
          this.toast.error('Please login to rate travelers', 'Login required');
        },
      });
  }
}
