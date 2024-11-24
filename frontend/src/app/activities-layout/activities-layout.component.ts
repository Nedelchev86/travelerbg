import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SetBgImageDirective } from '../set-bg-image.directive';

@Component({
  selector: 'app-activities-layout',
  standalone: true,
  imports: [RouterOutlet, SetBgImageDirective],
  templateUrl: './activities-layout.component.html',
  styleUrl: './activities-layout.component.css',
})
export class ActivitiesLayoutComponent {}
