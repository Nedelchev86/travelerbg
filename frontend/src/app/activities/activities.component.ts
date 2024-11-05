import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [SetBgImageDirective],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent {
  httpClient = inject(HttpClient);
  public data: Array<any> = [];
  ngOnInit() {
    this.httpClient.get('http://localhost:8000/api/activities/').subscribe({
      next: (data: any) => {
        this.data = data;
 
      },
      error: (err) => console.log(err),
    });
  }
}
