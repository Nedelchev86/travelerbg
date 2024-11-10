import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-top-travelers',
  standalone: true,
  imports: [SetBgImageDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-travelers.component.html',
  styleUrl: './top-travelers.component.css',
})
export class TopTravelersComponent implements OnInit {
  http = inject(HttpClient);
  top_travelers = Array<any>();
  ngOnInit() {
    this.http.get('http://localhost:8000/api/travelers/top-rated/').subscribe({
      next: (data: any) => {
        this.top_travelers = data;
        console.log(this.top_travelers);
      },
      error: (err) => console.log(err),
    });
  }
}
