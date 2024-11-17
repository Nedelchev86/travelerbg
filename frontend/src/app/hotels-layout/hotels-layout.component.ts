import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelsComponent } from '../hotels/hotels.component';
import { TopTravelersComponent } from '../top-travelers/top-travelers.component';
import { TopDestinationComponent } from "../top-destination/top-destination.component";
import { TopRatedDestinationsComponent } from '../top-rated-destinations/top-rated-destinations.component';

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
],
  templateUrl: './hotels-layout.component.html',
  styleUrl: './hotels-layout.component.css',
})
export class HotelsLayoutComponent {
  searchQuery: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

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
