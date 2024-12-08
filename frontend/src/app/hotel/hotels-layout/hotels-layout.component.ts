import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TopRatedDestinationsComponent } from '../../destination/top-rated-destinations/top-rated-destinations.component';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { ShapeMockupDirective } from '../../directives/shape-mockup.directive';
import { TopTravelersComponent } from '../../traveler/top-travelers/top-travelers.component';
import { HotelService } from '../../services/hotel.service';
import { HotelsCategory } from '../hotel-interface';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-hotels-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    TopTravelersComponent,
    FormsModule,
    TopTravelersComponent,
    ShapeMockupDirective,
    TopRatedDestinationsComponent,
    RouterLink,
    RouterLinkActive,
    BannerComponent,
    LoaderComponent
],
  templateUrl: './hotels-layout.component.html',
  styleUrl: './hotels-layout.component.css',
})
export class HotelsLayoutComponent implements OnInit {
  public searchQuery: string = '';
  public categories: HotelsCategory[] = [];
  public loading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private hotelsService: HotelService
  ) {}

  ngOnInit(): void {
    this.fetchHotelCategories();
  }

  fetchHotelCategories(): void {
    this.hotelsService.fetchHotelCategories().subscribe({
      next: (data: HotelsCategory[]) => {
        this.loading = false;
        this.categories = data;
      },
      error: (err) => console.log(err),
    });
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    this.router.navigate(['/hotels'], {
      relativeTo: this.route,
      queryParams: {
        name: this.searchQuery || null,
      },
      queryParamsHandling: 'merge', // Merge with existing query params
    });
  }
}
