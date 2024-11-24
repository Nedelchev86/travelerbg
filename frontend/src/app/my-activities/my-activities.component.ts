import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

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
  public activities: Array<any> = [];
  itemIdToDelete: string | null = null;

  ngOnInit() {
    this.http.get('http://localhost:8000/api/activities/my/').subscribe({
      next: (data: any) => {
        this.activities = data;
        console.log(data);
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
        .delete(`http://localhost:8000/api/activities/${this.itemIdToDelete}/`)
        .subscribe(
          (response) => {
            console.log('Item deleted:', this.itemIdToDelete);
            // Remove the deleted item from the data array
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
