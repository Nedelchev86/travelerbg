import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../hotel-interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-hotel',
  standalone: true,
  imports: [DeleteConfirmationModalComponent, RouterLink, CommonModule],
  templateUrl: './my-hotel.component.html',
  styleUrl: './my-hotel.component.css',
})
export class MyHotelComponent {
  public showModal = false;

  public hotels: Hotel[] = [];
  public itemIdToDelete: number | null = null;

  constructor(
    private hotelService: HotelService,
    private authServices: AuthService,
    public toast: ToastrService
  ) {}

  ngOnInit() {
    this.fetchMyHotels();
  }

  fetchMyHotels(): void {
    this.hotelService.fetchMyHotels().subscribe({
      next: (data: any) => {
        this.hotels = data;
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
      this.hotelService.deleteHotel(this.itemIdToDelete).subscribe({
        next: () => {
          this.authServices.fetchUserData();
          this.hotels = this.hotels.filter(
            (item) => item.id !== this.itemIdToDelete
          );
          this.closeModal();
          this.toast.success('Hotel deleted successfully');
        },
        error: (error) => {
          console.error('Failed to delete item', error);
          this.toast.error('Failed to delete hotel');
        },
      });
    }
  }
  // confirmDelete() {
  //   if (this.itemIdToDelete) {
  //     // Perform the delete action here
  //     this.http
  //       .delete(`${this.API_URL}hotels/${this.itemIdToDelete}/`)
  //       .subscribe(
  //         (response) => {
  //           this.authServices.fetchUserData();
  //           // Remove the deleted item from the data array
  //           this.data = this.data.filter(
  //             (item) => item.id !== this.itemIdToDelete
  //           );
  //           this.closeModal();
  //         },
  //         (error) => {
  //           console.error('Failed to delete item', error);
  //         }
  //       );
  //   }
  // }
}
