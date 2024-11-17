import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css',
})
export class HotelsComponent {
  httpClient = inject(HttpClient);
  public data: Array<any> = [];
  ngOnInit() {
    this.httpClient.get('http://localhost:8000/api/hotels/').subscribe({
      next: (data: any) => {
        this.data = data;
      },
      error: (err) => console.log(err),
    });
  }
}
