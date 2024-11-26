import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-activities-layout',
  standalone: true,
  imports: [RouterOutlet, SetBgImageDirective, RouterLink],
  templateUrl: './activities-layout.component.html',
  styleUrl: './activities-layout.component.css',
})
export class ActivitiesLayoutComponent implements OnInit {
  http = inject(HttpClient);
  categories: any = Array<any>();
  private readonly API_URL = environment.apiUrl;

  ngOnInit(): void {
    this.http.get(`${this.API_URL}categories/activities`).subscribe({
      next: (data: any) => {
        this.categories = data;
        console.log(this.categories);
      },
      error: (err) => console.log(err),
    });
  }
}
