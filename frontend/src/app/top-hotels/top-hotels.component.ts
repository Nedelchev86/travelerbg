import { HttpClient } from '@angular/common/http';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { LoaderComponent } from '../shared/loader/loader.component';
import { RouterLink } from '@angular/router';
import { SetBgImageDirective } from '../set-bg-image.directive';

@Component({
  selector: 'app-top-hotels',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink, LoaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-hotels.component.html',
  styleUrl: './top-hotels.component.css',
})
export class TopHotelsComponent implements OnInit {
  constructor() {}
  loading = true;
  hotels: any = [];
  http = inject(HttpClient);
  ngOnInit() {
    this.http.get('http://localhost:8000/api/hotels/').subscribe({
      next: (data: any) => {
        this.hotels = data;
        console.log(data);
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
}
