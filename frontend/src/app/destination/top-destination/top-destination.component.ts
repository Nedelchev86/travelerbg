import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { DestinationService } from '../../services/destination.service';
import { ApiResponse, Destination } from '../destination-interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-top-destination',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink, LoaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-destination.component.html',
  styleUrl: './top-destination.component.css',
})
export class TopDestinationComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  public loading = true;
  public top_destinations = <Destination[]>[];

  constructor(private destinationService: DestinationService) {}

  ngOnInit() {
    this.destinationService
      .fetchDestinations(1)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: ApiResponse) => {
          this.top_destinations = data.results;
          this.loading = false;
        },
        error: (err) => {
          console.log(err), (this.loading = false);
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
