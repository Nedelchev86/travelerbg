import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { AuthService } from '../../services/auth.service';
import { ActivityService } from '../../services/activity.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-my-activities',
  standalone: true,
  imports: [RouterLink, CommonModule, DeleteConfirmationModalComponent, LoaderComponent],
  templateUrl: './my-activities.component.html',
  styleUrl: './my-activities.component.css',
})
export class MyActivitiesComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public showModal = false;
  public activities: Array<any> = [];
  public itemIdToDelete: number | null = null;
  public loading = false;

  constructor(
    private authService: AuthService,
    private activityService: ActivityService,
    public toast: ToastrService
  ) {}

  ngOnInit() {
    this.fetchMyActivities();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchMyActivities(): void {
    this.loading = true;
    this.activityService.fetchMyActivities().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe({
      next: (data: any) => {
        this.activities = data;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
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
