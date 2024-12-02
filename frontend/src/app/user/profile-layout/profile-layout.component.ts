import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../auth.service';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { BreadcumbComponent } from '../../shared/components/breadcumb/breadcumb.component';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BannerComponent],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.css',
})
export class ProfileLayoutComponent {
  authService = inject(AuthService);
}
