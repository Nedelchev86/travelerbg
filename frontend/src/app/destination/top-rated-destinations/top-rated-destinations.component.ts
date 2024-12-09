import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';
import { DestinationService } from '../../services/destination.service';
import { Destination } from '../destination-interface';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-top-rated-destinations',
  standalone: true,
  imports: [RouterLink, CommonModule, LoaderComponent],
  templateUrl: './top-rated-destinations.component.html',
  styleUrl: './top-rated-destinations.component.css',
  providers: [DatePipe],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '1000ms ease-in',
          style({ opacity: 2, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class TopRatedDestinationsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  public destinations: Destination[] = [];
  public loading: boolean = true;

  constructor(private destinationsService: DestinationService) {}

  ngOnInit(): void {
    this.destinationsService
      .topDestinations()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: any) => {
          this.loading = false;
          this.destinations = data;
        },
        error: (err) => console.log(err),
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
