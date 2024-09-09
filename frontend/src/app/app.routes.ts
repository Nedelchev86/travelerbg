import { Routes } from '@angular/router';
import { DestinationsComponent } from './destinations/destinations.component';
import { MainComponent } from './main/main.component';
import { AppComponent } from './app.component';
import { TravelersComponent } from './travelers/travelers.component';
import { TravelersDetailsComponent } from './travelers-details/travelers-details.component';
import { DestinationDetailsComponent } from './destination-details/destination-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ActivitiesComponent } from './activities/activities.component';
import { HotelsComponent } from './hotels/hotels.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'destinations',
    title: 'Destinations',
    component: DestinationsComponent,
  },
  {
    path: 'details',
    component: DestinationDetailsComponent,
  },
  {
    path: 'destinations/:destinationID',
    component: DestinationDetailsComponent,
  },
  { path: 'travelers', title: 'Travelers', component: TravelersComponent },
  {
    path: 'activities',
    title: 'Activities',
    component: ActivitiesComponent,
  },
  {
    path: 'hotels',
    title: 'Hotels',
    component: HotelsComponent,
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },

  { path: '**', title: 'Page Not Found', component: PageNotFoundComponent },
];
