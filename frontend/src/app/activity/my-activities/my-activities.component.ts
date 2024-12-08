import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { ActivityService } from '../../services/activity.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-activities',
  standalone: true,
  imports: [RouterLink, CommonModule, DeleteConfirmationModalComponent],
  templateUrl: './my-activities.component.html',
  styleUrl: './my-activities.component.css',
})
export class MyActivitiesComponent {
  public showModal = false;
  public activities: Array<any> = [];
  public itemIdToDelete: number | null = null;

  constructor(
    private authService: AuthService,
    private activityService: ActivityService,
    public toast: ToastrService
  ) {}

  ngOnInit() {
    this.fetchMyActivities();
  }

  fetchMyActivities(): void {
    this.activityService.fetchMyActivities().subscribe({
      next: (data: any) => {
        this.activities = data;
      },
      error: (err) => console.log(err),
    });
  }

  openModal(itemId: number) {
    this.itemIdToDelete = itemId;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.itemIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.itemIdToDelete) {
      this.activityService.deleteActivity(this.itemIdToDelete).subscribe({
        next: () => {
          this.authService.fetchUserData();
          this.activities = this.activities.filter(
            (item) => item.id !== this.itemIdToDelete
          );
          this.closeModal();
          this.toast.success('Activity deleted successfully');
        },
        error: (error) => {
          console.error('Failed to delete activity', error);
          this.toast.error('Failed to delete activity');
        },
      });
    }
  }
}
