import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { CommonModule } from '@angular/common';
import { DestinationService } from '../../services/destination.service';
import { Destination } from '../destination-interface';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-my-destinations',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    DeleteConfirmationModalComponent,
    CommonModule,
    LoaderComponent
],
  templateUrl: './my-destinations.component.html',
  styleUrl: './my-destinations.component.css',
})
export class MyDestinationsComponent implements OnInit, OnDestroy{
  public loading: boolean = true;
  public showModal = false;
  public data: Destination[] = [];
  private itemIdToDelete: number | null = null;
  private unsubscribe$ = new Subject<void>();
  

  constructor(
    private destinationService: DestinationService,
    private authService: AuthService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.destinationService.myDestinations().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data: Destination[]) => {
        this.data = data;
        this.loading = false;
      },
      error: (err) => console.log(err),
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openModal(itemId: number) {
    this.itemIdToDelete = itemId;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.itemIdToDelete = null;
  }

  confirmDelete() {
    if (this.itemIdToDelete) {
      this.destinationService.deleteDestination(this.itemIdToDelete).subscribe({
        next: () => {
          this.authService.fetchUserData();
          this.data = this.data.filter(
            (item) => item.id != this.itemIdToDelete
          );
          this.closeModal();
          this.toast.success('Destination deleted successfully');
        },
        error: (error) => {
          console.error('Failed to delete item', error);
          this.toast.error('Failed to delete destination');
        },
      });
    }
  }
}
