import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { TravelerService } from '../../services/traveler.service';
import { Traveler } from '../traveler-interface';

@Component({
  selector: 'app-top-travelers',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-travelers.component.html',
  styleUrl: './top-travelers.component.css',
})
export class TopTravelersComponent implements OnInit {
  public top_travelers: Traveler[] = [];
  constructor(private travelerService: TravelerService) {}

  ngOnInit() {
    this.fetchTopTravelers();
  }

  fetchTopTravelers(): void {
    this.travelerService.fetchTopTravelers().subscribe({
      next: (data: Traveler[]) => {
        this.top_travelers = data;
      },
      error: (err) => console.log(err),
    });
  }
}
