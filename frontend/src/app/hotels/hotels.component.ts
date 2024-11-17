import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink, RatingComponent],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css',
})
export class HotelsComponent {
  private httpClient = inject(HttpClient);

  public data: Array<any> = [];
  public currentPage: number = 1;
  public totalPages: number = 1;
  public nextPageUrl: string | null = null;
  public previousPageUrl: string | null = null;
  public searchQuery: string = '';
  public categoryQuery: string = '';
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  loading = true;
  router = inject(Router);
  toast = inject(ToastrService);

  // ngOnInit() {
  //   this.httpClient.get('http://localhost:8000/api/hotels/').subscribe({
  //     next: (data: any) => {
  //       this.data = data;
  //     },
  //     error: (err) => console.log(err),
  //   });
  // }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['name'] || '';
      this.categoryQuery = params['category'] || '';
      this.fetchDestinations();
    });
  }

  fetchDestinations(url: string = 'http://localhost:8000/api/hotels/'): void {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
    };
    if (this.searchQuery) {
      params.name = this.searchQuery;
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
          console.log('data', data);
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
        name: this.searchQuery || null,
      },
      queryParamsHandling: 'merge', // Merge with existing query params
    });
  }
  getPaginationArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  updateHotelRating(hotelId: string, rating: number): void {
    const hotel = this.data.find((t) => t.id === hotelId);
    console.log('hotel', hotelId);
    if (hotel) {
      this.httpClient
        .get(`http://localhost:8000/api/hotels/${hotelId}`)
        .subscribe({
          next: (data: any) => {
            console.log('test', data);
            hotel.average_rating = data.average_rating;
            hotel.number_of_votes = data.number_of_votes;
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

  rateDestination(hotelId: string, rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate travelers', 'Login required');
      return;
    }

    this.httpClient
      .post(`http://localhost:8000/api/hotels/${hotelId}/rate/`, {
        rating,
      })
      .subscribe({
        next: (response) => {
          console.log('Rating submitted successfully', response);
          this.updateHotelRating(hotelId, rating);
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
