import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { TopHotelsComponent } from '../../top-hotels/top-hotels.component';
import { TopRatedDestinationsComponent } from '../../top-rated-destinations/top-rated-destinations.component';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-destinations-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    SetBgImageDirective,
    TopHotelsComponent,
    TopRatedDestinationsComponent,
    BannerComponent,
  ],
  templateUrl: './destinations-layout.component.html',
  styleUrl: './destinations-layout.component.css',
})
export class DestinationsLayoutComponent implements OnInit {
  http = inject(HttpClient);
  categories: any = Array<any>();
  private readonly API_URL = environment.apiUrl;

  ngOnInit(): void {
    this.http.get(`${this.API_URL}categories/`).subscribe({
      next: (data: any) => {
        this.categories = data;
        console.log(this.categories);
      },
      error: (err) => console.log(err),
    });
  }
}