import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-activities',
  standalone: true,
  imports: [RouterLink, CommonModule, DeleteConfirmationModalComponent],
  templateUrl: './my-activities.component.html',
  styleUrl: './my-activities.component.css',
})
export class MyActivitiesComponent {
  showModal = false;
  http = inject(HttpClient);
  authServices = inject(AuthService);
  public activities: Array<any> = [];
  private readonly API_URL = environment.apiUrl;
  itemIdToDelete: string | null = null;

  ngOnInit() {
    this.http.get(`${this.API_URL}activities/my/`).subscribe({
      next: (data: any) => {
        this.activities = data;
      },
      error: (err) => console.log(err),
    });
  }

  openModal(itemId: string) {
    this.itemIdToDelete = itemId;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.itemIdToDelete = null;
  }

  confirmDelete() {
    if (this.itemIdToDelete) {
      // Perform the delete action here
      this.http
        .delete(`${this.API_URL}activities/${this.itemIdToDelete}/`)
        .subscribe(
          (response) => {
            // Remove the deleted item from the data array
            this.authServices.fetchUserData();
            this.activities = this.activities.filter(
              (item) => item.id !== this.itemIdToDelete
            );
            this.closeModal();
          },
          (error) => {
            console.error('Failed to delete item', error);
          }
        );
    }
  }
}
