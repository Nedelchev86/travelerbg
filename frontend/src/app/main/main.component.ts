import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { ShapeMockupDirective } from '../shape-mockup.directive';
import { TopTravelersComponent } from '../top-travelers/top-travelers.component';
import { TopDestinationComponent } from '../top-destination/top-destination.component';
import { TopHotelsComponent } from '../top-hotels/top-hotels.component';
import { RouterLink } from '@angular/router';

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
