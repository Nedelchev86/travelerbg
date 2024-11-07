import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoginRegisterComponent } from '../login-register/login-register.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../user-interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LoginRegisterComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLoginRegisterPopupVisible = false;
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.http.get<UserInterface>('http://localhost:8000/api/user').subscribe({
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
    localStorage.removeItem('token');
    this.authService.currentUser.set(null);
    this.router.navigate(['/']);
  }
}
