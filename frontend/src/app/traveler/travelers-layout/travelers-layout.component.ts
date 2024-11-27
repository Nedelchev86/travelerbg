import { Component } from '@angular/core';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TopRatedDestinationsComponent } from '../../top-rated-destinations/top-rated-destinations.component';
import { TopHotelsComponent } from '../../top-hotels/top-hotels.component';
import { ShapeMockupDirective } from '../../directives/shape-mockup.directive';
import { BreadcumbComponent } from '../../shared/components/breadcumb/breadcumb.component';

@Component({
  selector: 'app-travelers-layout',
  standalone: true,
  imports: [
    BannerComponent,
    RouterOutlet,
    TopRatedDestinationsComponent,
    TopHotelsComponent,
    ShapeMockupDirective,
    BreadcumbComponent,
  ],
  templateUrl: './travelers-layout.component.html',
  styleUrl: './travelers-layout.component.css',
})
export class TravelersLayoutComponent {}
