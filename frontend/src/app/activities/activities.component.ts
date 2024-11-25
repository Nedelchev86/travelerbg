import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { RouterLink, RouterOutlet } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
})
export class ActivitiesComponent {
  httpClient = inject(HttpClient);
  public data: Array<any> = [];
  private readonly API_URL = environment.apiUrl;
  ngOnInit() {
    this.httpClient.get(`${this.API_URL}activities/`).subscribe({
      next: (data: any) => {
        this.data = data;
      },
      error: (err) => console.log(err),
    });
  }
}
