import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DestinationService } from '../../services/destination.service';
import { Destination } from '../destination-interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-destinations-by-user',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './destinations-by-user.component.html',
  styleUrl: './destinations-by-user.component.css',
})
export class DestinationsByUserComponent implements OnInit {
  @Input() user: number = 0;
  destinations: Destination[] = [];

  constructor(
    private destinationService: DestinationService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchUserDestinations(this.user);
  }

  fetchUserDestinations(userId: number): void {
    this.destinationService.fetchUserDestinations(userId).subscribe({
      next: (data: Destination[]) => {
        this.destinations = data;
      },
      error: (error) => {
        console.error('Failed to fetch user destinations', error);
        this.toast.error('Failed to fetch user destinations');
      },
    });
  }
}
