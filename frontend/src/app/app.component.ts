import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { TraleversComponent } from './travelers/travelers.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { DestinationDetailsComponent } from './destination-details/destination-details.component';
import { ActivitiesComponent } from './activities/activities.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { ProfileComponent } from './profile/profile.component';
import { AddDestinationComponent } from './add-destination/add-destination.component';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    RouterOutlet,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    TraleversComponent,
    DestinationsComponent,
    DestinationDetailsComponent,
    ActivitiesComponent,
    LoginRegisterComponent,
    ProfileComponent,
    AddDestinationComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
