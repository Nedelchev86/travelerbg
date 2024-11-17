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
import { DestinationsLayoutComponent } from './destinations-layout/destinations-layout.component';
import { AddHotelComponent } from './add-hotel/add-hotel.component';
import { MyHotelComponent } from './my-hotel/my-hotel.component';
import { HotelEditComponent } from './hotel-edit/hotel-edit.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { HotelsLayoutComponent } from './hotels-layout/hotels-layout.component';
import { EditBusinessProfileComponent } from './edit-business-profile/edit-business-profile.component';

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
    component: DestinationsLayoutComponent,
    children: [
      { path: '', component: DestinationsComponent },
      { path: ':destinationId', component: DestinationDetailsComponent },
    ],
  },
  {
    path: 'hotels',
    title: 'Hotels',
    component: HotelsLayoutComponent,
    children: [
      { path: '', component: HotelsComponent },
      { path: ':hotelId', component: HotelDetailsComponent },
    ],
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
      { path: 'my-hotels', component: MyHotelComponent },
      { path: 'edit-destination/:id', component: EditDestinationComponent },
      { path: 'add-hotel', component: AddHotelComponent },
      { path: 'edit-hotel/:id', component: HotelEditComponent },
      { path: 'edit-profile', component: EditBusinessProfileComponent },
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
