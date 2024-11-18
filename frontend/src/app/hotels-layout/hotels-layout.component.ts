import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelsComponent } from '../hotels/hotels.component';
import { TopTravelersComponent } from '../top-travelers/top-travelers.component';
import { TopDestinationComponent } from '../top-destination/top-destination.component';
import { TopRatedDestinationsComponent } from '../top-rated-destinations/top-rated-destinations.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hotels-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    TopTravelersComponent,
    SetBgImageDirective,
    FormsModule,
    HotelsComponent,
    TopTravelersComponent,
    TopDestinationComponent,
    TopRatedDestinationsComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './hotels-layout.component.html',
  styleUrl: './hotels-layout.component.css',
})
export class HotelsLayoutComponent implements OnInit {
  searchQuery: string = '';
  categories: any = Array<any>();

  http = inject(HttpClient);

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8000/api/categories/hotels/').subscribe({
      next: (data: any) => {
        this.categories = data;
        console.log(this.categories);
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
