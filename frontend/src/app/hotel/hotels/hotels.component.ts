import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RatingComponent } from '../../shared/components/rating/rating.component';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { HotelService } from '../../services/hotel.service';
import { Hotel, HotelsResponse } from '../hotel-interface';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [RouterLink, RatingComponent, RouterLink, LoaderComponent],
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

  public hotels: Hotel[] = [];
  public currentPage: number = 1;
  public totalPages: number = 1;
  public nextPageUrl: string | null = null;
  public previousPageUrl: string | null = null;
  public searchQuery: string = '';
  public categoryQuery: string = '';
  private readonly API_URL = environment.apiUrl;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService,
    private hotelService: HotelService
  ) {}


  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['name'] || '';
      this.categoryQuery = params['category'] || '';
      this.fetchHotels();
    });
  }

  fetchHotels(): void {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
      name: this.searchQuery,
      category: this.categoryQuery,
    };

    this.hotelService.fetchHotels(params).subscribe({
      next: (data: HotelsResponse) => {
        this.hotels = data.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch hotels', error);
        this.toast.error('Failed to fetch hotels');
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

  updateHotelRating(hotelId: number, rating: number): void {
    const hotel = this.hotels.find((t) => t.id === hotelId);
    if (hotel) {
      this.hotelService.getHotel(hotelId).subscribe({
        next: (data: Hotel) => {
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

  rateDestination(hotelId: number, rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to rate hotel', 'Login required');
      return;
    }
    this.hotelService.rateHotel(hotelId, rating).subscribe({
      next: (response) => {
        this.updateHotelRating(hotelId, rating);
        this.toast.success('Rating submitted successfully');
      },
      error: (err) => {
        this.toast.error('Please login to rate hotel', 'Login required');
      },
    });
  }
}
