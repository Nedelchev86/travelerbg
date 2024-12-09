import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoginRegisterComponent } from '../../user/login-register/login-register.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
  public isLoginRegisterPopupVisible = false;
  public authService = inject(AuthService);
  public faTimes = faTimes;
  public isBodyVisible = false;

  constructor(public router: Router) {}

  ngOnInit(): void {}

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
