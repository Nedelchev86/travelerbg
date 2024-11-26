import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoginRegisterComponent } from '../login-register/login-register.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../user-interface';
import { faFontAwesome, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LoginRegisterComponent,
    CommonModule,
    FontAwesomeModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLoginRegisterPopupVisible = false;
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  faTimes = faTimes;
  isBodyVisible = false;
  private readonly API_URL = environment.apiUrl;

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.http.get<UserInterface>(`${this.API_URL}user`).subscribe({
        next: (response) => {
          console.log('response', response);
          this.authService.currentUser.set(response);
          console.log('User data:', this.authService.currentUser());
        },
        error: () => {
          this.authService.currentUser.set(null);
        },
      });
    }
  }

  openLoginRegisterPopup() {
    this.isLoginRegisterPopupVisible = true;
  }

  closeLoginRegisterPopup() {
    this.isLoginRegisterPopupVisible = false;
  }

  logout() {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.isBodyVisible = !this.isBodyVisible;
  }
}
