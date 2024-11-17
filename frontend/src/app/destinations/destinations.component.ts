import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../shared/loader/loader.component';
import { TopTravelersComponent } from '../top-travelers/top-travelers.component';
import { RatingComponent } from '../rating/rating.component';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    LoaderComponent,
    LoaderComponent,
    TopTravelersComponent,
    TopTravelersComponent,
    RatingComponent,
  ],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css',
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

  fetchDestinations(
    url: string = 'http://localhost:8000/api/destinations/'
  ): void {
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
          console.log('loaded', data);
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

    this.httpClient
      .get('http://localhost:8000/api/destinations/', { params })
      .subscribe({
        next: (data: any) => {
          this.data = data.results;
          console.log(data.results);
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

  updateDestinationRating(destinationId: string, rating: number): void {
    const destination = this.data.find((t) => t.id === destinationId);
    console.log('destination', destination);
    if (destination) {
      this.httpClient
        .get(`http://localhost:8000/api/destinations/${destinationId}`)
        .subscribe({
          next: (data: any) => {
            console.log('test', data);
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
      .post(`http://localhost:8000/api/destinations/${destinationId}/rate/`, {
        rating,
      })
      .subscribe({
        next: (response) => {
          console.log('Rating submitted successfully', response);
          this.updateDestinationRating(destinationId, rating);
          this.toast.success('Rating submitted successfully');
        },
        error: (err) => {
          console.log('Failed to submit rating', err),
            this.toast.error(
              'Please login to rate travelers',
              'Login required'
            );
        },
      });
  }
}
