import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../hotel-interface';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-my-hotel',
  standalone: true,
  imports: [
    DeleteConfirmationModalComponent,
    RouterLink,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: './my-hotel.component.html',
  styleUrl: './my-hotel.component.css',
})
export class MyHotelComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  public showModal = false;
  public hotels: Hotel[] = [];
  public itemIdToDelete: number | null = null;
  public loading = false;

  constructor(
    private hotelService: HotelService,
    private authServices: AuthService,
    public toast: ToastrService
  ) {}

  ngOnInit() {
    this.fetchMyHotels();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchMyHotels(): void {
    this.loading = true;
    this.hotelService
      .fetchMyHotels()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: any) => {
          this.hotels = data;
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
}
