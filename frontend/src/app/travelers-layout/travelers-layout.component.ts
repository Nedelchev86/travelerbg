import { Component } from '@angular/core';
import { BannerComponent } from '../shared/banner/banner.component';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TopRatedDestinationsComponent } from '../top-rated-destinations/top-rated-destinations.component';
import { TopHotelsComponent } from '../top-hotels/top-hotels.component';
import { ShapeMockupDirective } from '../shape-mockup.directive';

@Component({
  selector: 'app-travelers-layout',
  standalone: true,
  imports: [
    BannerComponent,
    SetBgImageDirective,
    RouterOutlet,
    TopRatedDestinationsComponent,
    TopHotelsComponent,
    ShapeMockupDirective,
    RouterLink,
  ],
  templateUrl: './travelers-layout.component.html',
  styleUrl: './travelers-layout.component.css',
})
export class TravelersLayoutComponent {}
