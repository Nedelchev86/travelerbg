import { HttpClient } from '@angular/common/http';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { environment } from '../../../environments/environment';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-top-hotels',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink, LoaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-hotels.component.html',
  styleUrl: './top-hotels.component.css',
})
export class TopHotelsComponent implements OnInit {
  public loading = true;
  public hotels: any = [];

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.fetchTopRatedHotels();
  }

  fetchTopRatedHotels(): void {
    this.hotelService.fetchTopRatedHotels().subscribe({
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
