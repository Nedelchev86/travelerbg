import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-destinations-by-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './destinations-by-user.component.html',
  styleUrl: './destinations-by-user.component.css',
})
export class DestinationsByUserComponent implements OnInit {
  @Input() user: Number = 0;
  http = inject(HttpClient);
  destinations: any[] = [];

  ngOnInit(): void {
    this.http
      .get(`http://localhost:8000/api/destinations/by_user/${this.user}/`)
      .subscribe(
        (data: any) => {
          console.log('User Destinations:', data);
          this.destinations = data;
        },
        (error) => {
          console.error('Failed to fetch user destinations', error);
        }
      );
  }
}
