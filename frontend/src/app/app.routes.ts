import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { TraleversComponent } from './travelers/travelers.component';
import { TravelersDetailsComponent } from './travelers-details/travelers-details.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { DestinationDetailsComponent } from './destination-details/destination-details.component';
import { HotelsComponent } from './hotels/hotels.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './editprofile/editprofile.component';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'travelers',
    title: 'Travelers',
    component: TraleversComponent,
  },
  { path: 'travelers/:travelerId', component: TravelersDetailsComponent },
  {
    path: 'destinations',
    title: 'Destinations',
    children: [
      { path: '', component: DestinationsComponent },
      { path: ':destinationId', component: DestinationDetailsComponent },
    ],
  },
  {
    path: 'hotels',
    title: 'Hotels',
    component: HotelsComponent,
    // children: [{ path: 'post', component: PostHotelComponent }],
  },
  {
    path: 'activities',
    title: 'Activities',
    component: ActivitiesComponent,
  },
  {
    path: 'profile',
    title: 'Profile',
    component: ProfileLayoutComponent,
    children: [
      { path: '', component: ProfileComponent },
      { path: 'edit', component: EditProfileComponent },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
