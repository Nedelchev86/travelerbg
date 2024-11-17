import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-rated-destinations',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './top-rated-destinations.component.html',
  styleUrl: './top-rated-destinations.component.css',
  providers: [DatePipe],
})
export class TopRatedDestinationsComponent implements OnInit {
  http = inject(HttpClient);
  destinations = Array<any>();
  // public date = inject(DatePipe);

  ngOnInit(): void {
    this.http
      .get('http://localhost:8000/api/destinations/top-rated/')
      .subscribe({
        next: (data: any) => {
          this.destinations = data;
          console.log(this.destinations);
        },
        error: (err) => console.log(err),
      });
  }
}
