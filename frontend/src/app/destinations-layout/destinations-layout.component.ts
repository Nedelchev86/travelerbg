import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { HttpClient } from '@angular/common/http';
import { TopTravelersComponent } from '../top-travelers/top-travelers.component';

@Component({
  selector: 'app-destinations-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SetBgImageDirective,
    TopTravelersComponent,
  ],
  templateUrl: './destinations-layout.component.html',
  styleUrl: './destinations-layout.component.css',
})
export class DestinationsLayoutComponent implements OnInit {
  http = inject(HttpClient);
  categories: any = Array<any>();

  ngOnInit(): void {
    this.http.get('http://localhost:8000/api/categories/').subscribe({
      next: (data: any) => {
        this.categories = data;
        console.log(this.categories);
      },
      error: (err) => console.log(err),
    });
  }
}
