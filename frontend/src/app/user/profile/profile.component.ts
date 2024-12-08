import {
  AfterContentInit,
  AfterViewInit,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  authService = inject(AuthService);
  role = JSON.parse(localStorage.getItem('currentUser') || '{}');
}
