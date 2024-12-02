import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoginRegisterComponent } from '../../user/login-register/login-register.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../../user-interface';
import { faFontAwesome, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../../../environments/environment';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

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
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
        })
      ),
      transition(':enter', [
        animate(
          '0.5s ease-in',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '0.5s ease-out',
          style({
            opacity: 0,
            transform: 'translateY(-20px)',
          })
        ),
      ]),
    ]),
  ],
})
export class HeaderComponent {
  isLoginRegisterPopupVisible = false;
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);
  faTimes = faTimes;
  isBodyVisible = false;
  private readonly API_URL = environment.apiUrl;

  // isSticky = false;

  // @HostListener('window:scroll', [])
  // onScroll(): void {
  //   this.isSticky = window.scrollY > 0; // Add class when scrolled
  // }

  ngOnInit(): void {
    // if (localStorage.getItem('token')) {
    //   this.http.get<UserInterface>(`${this.API_URL}user`).subscribe({
    //     next: (response) => {
    //       this.authService.currentUser.set(response);
    //     },
    //     error: () => {
    //       this.authService.currentUser.set(null);
    //     },
    //   });
    // }
  }

  openLoginRegisterPopup() {
    // if (this.isBodyVisible) {
    //   this.isBodyVisible = false;
    // }
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
