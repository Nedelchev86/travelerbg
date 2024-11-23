import { Component } from '@angular/core';
import { SetBgImageDirective } from '../../set-bg-image.directive';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [SetBgImageDirective],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent {
  constructor() {}
  //
}
