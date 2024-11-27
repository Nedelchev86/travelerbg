import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-top-rated-destinations',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './top-rated-destinations.component.html',
  styleUrl: './top-rated-destinations.component.css',
  providers: [DatePipe],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '1000ms ease-in',
          style({ opacity: 2, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class TopRatedDestinationsComponent implements OnInit {
  http = inject(HttpClient);
  destinations = Array<any>();
  private readonly API_URL = environment.apiUrl;
  // public date = inject(DatePipe);

  ngOnInit(): void {
    this.http.get(`${this.API_URL}destinations/top-rated/`).subscribe({
      next: (data: any) => {
        this.destinations = data;
      },
      error: (err) => console.log(err),
    });
  }
}
