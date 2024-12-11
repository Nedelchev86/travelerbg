import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { BreadcumbComponent } from '../../shared/components/breadcumb/breadcumb.component';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    BannerComponent,
    DeleteConfirmationModalComponent,
    CommonModule,
  ],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.css',
})
export class ProfileLayoutComponent {
  public showModal = false;

  constructor(
    public authService: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {}

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirmDelete(): void {
    this.authService.deleteUser().subscribe({
      next: () => {
        this.authService.logout();
        this.closeModal();
        this.toast.success('Account deleted successfully');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 0) {
          this.authService.logout();
          this.closeModal();
          this.toast.success('Account deleted successfully');
          this.router.navigate(['/']);
          return;
        }
        this.toast.error('Failed to delete Account');
      },
    });
  }
}
