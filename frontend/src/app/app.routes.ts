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
import { AddDestinationComponent } from './add-destination/add-destination.component';
import { MyDestinationsComponent } from './my-destinations/my-destinations.component';
import { ContactComponent } from './contact/contact.component';
import { EditDestinationComponent } from './edit-destination/edit-destination.component';
import { AuthGuard } from './auth.guard';

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
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: 'edit', component: EditProfileComponent },
      { path: 'add-destination', component: AddDestinationComponent },
      { path: 'my-destinations', component: MyDestinationsComponent },
      { path: 'edit-destination/:id', component: EditDestinationComponent },
    ],
  },

  {
    path: 'contact-us',
    title: 'Contact Us',
    component: ContactComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
