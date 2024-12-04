import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-top-travelers',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-travelers.component.html',
  styleUrl: './top-travelers.component.css',
})
export class TopTravelersComponent implements OnInit {
  http = inject(HttpClient);
  top_travelers = Array<any>();
  private readonly API_URL = environment.apiUrl;
  ngOnInit() {
    this.http.get(`${this.API_URL}travelers/top-rated/`).subscribe({
      next: (data: any) => {
        this.top_travelers = data;
      },
      error: (err) => console.log(err),
    });
  }
}
