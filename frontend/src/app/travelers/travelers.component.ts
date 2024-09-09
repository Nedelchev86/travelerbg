import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { SetBgImageDirective } from '../set-bg-image.directive';

@Component({
  selector: 'app-travelers',
  standalone: true,
  imports: [RouterLink, SetBgImageDirective],
  templateUrl: './travelers.component.html',
  styleUrl: './travelers.component.css',
})
export class TravelersComponent {
  httpClient = inject(HttpClient);
  public data: Array<any> = [];
  ngOnInit() {
    this.httpClient.get('http://localhost:8000/api/travelers/').subscribe({
      next: (data: any) => {
        this.data = data;
      },
      error: (err) => console.log(err),
    });
  }
}
