import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { HotelService } from '../../services/hotel.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-top-hotels',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink, LoaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-hotels.component.html',
  styleUrl: './top-hotels.component.css',
})
export class TopHotelsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public loading = true;
  public hotels: any = [];

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.fetchTopRatedHotels();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchTopRatedHotels(): void {
    this.hotelService
      .fetchTopRatedHotels()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: any) => {
          this.hotels = data;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }
}
