import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../shared/loader/loader.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-top-destination',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink, LoaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './top-destination.component.html',
  styleUrl: './top-destination.component.css',
})
export class TopDestinationComponent implements OnInit {
  loading = true;
  http = inject(HttpClient);
  top_destinations = Array<any>();
  private readonly API_URL = environment.apiUrl;
  ngOnInit() {
    this.http.get(`${this.API_URL}destinations/`).subscribe({
      next: (data: any) => {
        this.top_destinations = data.results;
        this.loading = false;
      },
      error: (err) => {
        console.log(err), (this.loading = false);
        this.loading = false;
      },
    });
  }
  // ngAfterViewInit() {
  //   this.loadScript('assets/js/test.js');
  // }

  // loadScript(src: string) {
  //   const script = document.createElement('script');
  //   script.src = src;
  //   script.type = 'text/javascript';
  //   script.async = true;
  //   script.onload = () => {
  //     console.log('Script loaded successfully.');
  //   };
  //   script.onerror = () => {
  //     console.error('Error loading script.');
  //   };
  //   document.body.appendChild(script);
  // }
}
