import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RouterLink } from '@angular/router';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { ShapeMockupDirective } from '../../directives/shape-mockup.directive';
import { TopTravelersComponent } from '../../top-travelers/top-travelers.component';
import { TopDestinationComponent } from '../../top-destination/top-destination.component';
import { TopHotelsComponent } from '../../top-hotels/top-hotels.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    SetBgImageDirective,
    ShapeMockupDirective,
    TopTravelersComponent,
    TopDestinationComponent,
    TopHotelsComponent,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {}
