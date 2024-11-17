import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-hotel',
  standalone: true,
  imports: [DeleteConfirmationModalComponent, RouterLink, CommonModule],
  templateUrl: './my-hotel.component.html',
  styleUrl: './my-hotel.component.css',
})
export class MyHotelComponent {
  showModal = false;
  http = inject(HttpClient);
  public data: Array<any> = [];
  itemIdToDelete: string | null = null;

  ngOnInit() {
    this.http.get('http://localhost:8000/api/hotels/my/').subscribe({
      next: (data: any) => {
        this.data = data;
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
        .delete(`http://localhost:8000/api/hotels/${this.itemIdToDelete}/`)
        .subscribe(
          (response) => {
            console.log('Item deleted:', this.itemIdToDelete);
            // Remove the deleted item from the data array
            this.data = this.data.filter(
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
