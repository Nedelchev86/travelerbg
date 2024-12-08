import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment'; // Import the environment configuration
import { Activity } from '../activities/activity-iterface';
import { ActivityService } from '../../services/activity.service';

interface FavoriteStatusResponse {
  is_favorite: boolean;
}

@Component({
  selector: 'app-activitie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activitie-details.component.html',
  styleUrl: './activitie-details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActivitieDetailsComponent {
  public isFavorite: boolean = false;
  public activitie: Activity = {} as Activity; // Store hotel data
  public activitieId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.activitieId = Number(this.route.snapshot.paramMap.get('activitieId'));
    if (this.activitieId) {
      this.fetchActivitieDetails(this.activitieId);
    }
  }

  fetchActivitieDetails(activitieId: number): void {
    this.activityService.getActivityDetails(activitieId).subscribe({
      next: (data: Activity) => {
        this.activitie = data;
        this.checkIsFavorite(activitieId);
      },
      error: (error) => {
        console.error('Error fetching activity details:', error);
        this.toast.error('Failed to fetch activity details');
      },
    });
  }

  checkIsFavorite(activitieId: number): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.activityService.checkIsFavorite(activitieId).subscribe({
      next: (data: any) => {
        this.isFavorite = data.is_favorite;
      },
      error: (error) => {
        console.error('Error checking favorite status:', error);
        this.toast.error('Failed to check favorite status');
      },
    });
  }

  addToFavorites(activityId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.error('Please login to add to favorites', 'Login required');
      return;
    }
    this.activityService.addToFavorites(activityId).subscribe({
      next: () => {
        this.isFavorite = true; // Set favorite status to true
        this.toast.success('Added to favorites successfully');
      },
      error: (err) => {
        console.error('Failed to add to favorites', err);
        this.toast.error('Failed to add to favorites');
      },
    });
  }

  removeFromFavorites(activityId: number): void {
    this.activityService.removeFromFavorites(activityId).subscribe({
      next: () => {
        this.isFavorite = false; // Set favorite status to false
        this.toast.success('Removed from favorites successfully');
      },
      error: (err) => {
        console.error('Failed to remove from favorites', err);
        this.toast.error('Failed to remove from favorites');
      },
    });
  }
}
