import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { environment } from '../../../environments/environment';
import { DestinationService } from '../../services/destination.service';
import { ApiResponse, Destination } from '../destination-interface';

@Component({
  selector: 'app-top-destination',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink, LoaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-destination.component.html',
  styleUrl: './top-destination.component.css',
})
export class TopDestinationComponent implements OnInit {
  constructor(private destinationService: DestinationService) {}
  public loading = true;

  public top_destinations = <Destination[]>[];

  ngOnInit() {
    this.destinationService.fetchDestinations(1).subscribe({
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
}
