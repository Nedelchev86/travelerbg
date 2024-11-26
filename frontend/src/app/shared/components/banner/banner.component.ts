import { Component } from '@angular/core';
import { SetBgImageDirective } from '../../../directives/set-bg-image.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent {
  constructor() {}
  //
}
