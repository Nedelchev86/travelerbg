import {
  AfterContentInit,
  AfterViewInit,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../shared/components/loader/loader.component';

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
