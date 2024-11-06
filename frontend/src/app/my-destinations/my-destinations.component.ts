import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { SetBgImageDirective } from '../set-bg-image.directive';

@Component({
  selector: 'app-my-destinations',
  standalone: true,
  imports: [SetBgImageDirective],
  templateUrl: './my-destinations.component.html',
  styleUrl: './my-destinations.component.css',
})
export class MyDestinationsComponent {
  httpClient = inject(HttpClient);
  public data: Array<any> = [];

  ngOnInit() {
    this.httpClient
      .get('http://localhost:8000/api/destinations/my/')
      .subscribe({
        next: (data: any) => {
          this.data = data;
          console.log(data);
        },
        error: (err) => console.log(err),
      });
  }
}
