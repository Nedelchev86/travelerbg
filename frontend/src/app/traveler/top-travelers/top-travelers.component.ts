import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { TravelerService } from '../../services/traveler.service';
import { Traveler } from '../traveler-interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-top-travelers',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-travelers.component.html',
  styleUrl: './top-travelers.component.css',
})
export class TopTravelersComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public top_travelers: Traveler[] = [];
  constructor(private travelerService: TravelerService) {}

  ngOnInit() {
    this.fetchTopTravelers();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchTopTravelers(): void {
    this.travelerService
      .fetchTopTravelers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: Traveler[]) => {
          this.top_travelers = data;
        },
        error: (err) => console.log(err),
      });
  }
}
