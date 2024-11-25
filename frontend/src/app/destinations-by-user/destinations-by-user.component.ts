import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../environments/environment';

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
  private readonly API_URL = environment.apiUrl;

  ngOnInit(): void {
    this.http
      .get(`${this.API_URL}destinations/by_user/${this.user}/`)
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
