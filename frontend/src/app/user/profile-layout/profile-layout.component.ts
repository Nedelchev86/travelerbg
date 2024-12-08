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
  authService = inject(AuthService);
  private http = inject(HttpClient);
  private toast = inject(ToastrService);
  private router = inject(Router);

  public showModal = false;
  public activities: Array<any> = [];

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirmDelete(): void {
    this.http.delete('http://localhost:8000/api/user/').subscribe({
      next: () => {
        this.authService.logout();
        this.closeModal();
        this.router.navigate(['/']);

        this.toast.success('Account deleted successfully');
      },
      error: (error) => {
        console.error('Failed to delete Account', error);
        this.toast.error('Failed to delete Account');
      },
    });
  }
}
