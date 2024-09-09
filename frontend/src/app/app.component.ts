import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { SetBgImageDirective } from './set-bg-image.directive';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TravelersComponent } from './travelers/travelers.component';
import { DestinationDetailsComponent } from './destination-details/destination-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ActivitiesComponent } from './activities/activities.component';
import { HotelsComponent } from './hotels/hotels.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoginComponent } from './login/login.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    TravelersComponent,
    DestinationDetailsComponent,
    DestinationsComponent,
    RouterLink,
    SetBgImageDirective,
    RouterOutlet,
    LoginComponent,
    HotelsComponent,
    PageNotFoundComponent,

    ActivitiesComponent,
    // NgCircleProgressModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
