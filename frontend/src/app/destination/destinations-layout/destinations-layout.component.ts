import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TopRatedDestinationsComponent } from '../top-rated-destinations/top-rated-destinations.component';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { TopHotelsComponent } from '../../hotel/top-hotels/top-hotels.component';
import { DestinationCategory } from '../destination-interface';
import { DestinationService } from '../../services/destination.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-destinations-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    TopHotelsComponent,
    TopRatedDestinationsComponent,
    BannerComponent,
  ],
  templateUrl: './destinations-layout.component.html',
  styleUrl: './destinations-layout.component.css',
})
export class DestinationsLayoutComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  constructor(private destinationsService: DestinationService) {}

  categories: DestinationCategory[] = [];

  ngOnInit(): void {
    this.destinationsService
      .getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: any) => {
          this.categories = data;
        },
        error: (err) => console.log(err),
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
