import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { RatingComponent } from '../../rating/rating.component';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [RouterLink, RatingComponent, LoaderComponent],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        // Initial state for the elements
        query(':enter', [style({ opacity: 0 })], { optional: true }),
        // Stagger the elements with an animation
        query(
          ':enter',
          [
            stagger('400ms', [
              animate('1000ms ease-out', style({ opacity: 1 })),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
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
  private readonly API_URL = environment.apiUrl;
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

  fetchDestinations(url: string = `${this.API_URL}hotels/`): void {
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
    if (hotel) {
      this.httpClient.get(`${this.API_URL}hotels/${hotelId}`).subscribe({
        next: (data: any) => {
          hotel.average_rating = data.average_rating;
          hotel.number_of_votes = data.number_of_votes;
        },
        error: (err) => {
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
      .post(`${this.API_URL}hotels/${hotelId}/rate/`, {
        rating,
      })
      .subscribe({
        next: (response) => {
          this.updateHotelRating(hotelId, rating);
          this.toast.success('Rating submitted successfully');
        },
        error: (err) => {
          this.toast.error('Please login to rate travelers', 'Login required');
        },
      });
  }
}
