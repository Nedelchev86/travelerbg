import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-destination-details',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink],
  templateUrl: './destination-details.component.html',
  styleUrl: './destination-details.component.css'
})
export class DestinationDetailsComponent {
  httpClient = inject(HttpClient);
  public data: Array<any> = [];
  ngOnInit() {
    this.httpClient.get('http://localhost:8000/api/destinations/').subscribe({
      next: (data: any) => {
        this.data = data;
      },
      error: (err) => console.log(err),
    });
  }
}
