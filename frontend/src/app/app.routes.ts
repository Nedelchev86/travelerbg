import { Routes } from '@angular/router';
import { TraleversComponent } from './traveler/travelers/travelers.component';
import { TravelersDetailsComponent } from './traveler/travelers-details/travelers-details.component';
import { DestinationDetailsComponent } from './destination/destination-details/destination-details.component';
import { ActivitiesComponent } from './activity/activities/activities.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './editprofile/editprofile.component';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { MyDestinationsComponent } from './destination/my-destinations/my-destinations.component';
import { ContactComponent } from './core/contact/contact.component';

import { AuthGuard } from './guards/auth.guard';
import { DestinationsLayoutComponent } from './destination/destinations-layout/destinations-layout.component';
import { AddHotelComponent } from './hotel/add-hotel/add-hotel.component';
import { MyHotelComponent } from './hotel/my-hotel/my-hotel.component';

import { HotelsLayoutComponent } from './hotel/hotels-layout/hotels-layout.component';
import { EditBusinessProfileComponent } from './edit-business-profile/edit-business-profile.component';
import { editDestinationGuard } from './guards/edit-destination.guard';
import { editHotelGuard } from './guards/edit-hotel.guard';
import { EditActivitieComponent } from './edit-activitie/edit-activitie.component';
import { editActivitiesGuard } from './guards/edit-activities.guard';
import { ActivitieDetailsComponent } from './activity/activitie-details/activitie-details.component';
import { ActivitiesLayoutComponent } from './activity/activities-layout/activities-layout.component';

import { TravelersLayoutComponent } from './traveler/travelers-layout/travelers-layout.component';
import { BookmarkedComponent } from './bookmarked/bookmarked.component';
import { DestinationsComponent } from './destination/destinations/destinations.component';
import { EditDestinationComponent } from './destination/edit-destination/edit-destination.component';
import { AddDestinationComponent } from './destination/add-destination/add-destination.component';
import { HotelsComponent } from './hotel/hotels/hotels.component';
import { HotelDetailsComponent } from './hotel/hotel-details/hotel-details.component';
import { HotelEditComponent } from './hotel/hotel-edit/hotel-edit.component';
import { MainComponent } from './core/main/main.component';
import { isActivatedGuard } from './guards/is-activated.guard';
import { AddActivitiesComponent } from './activity/add-activities/add-activities.component';
import { MyActivitiesComponent } from './activity/my-activities/my-activities.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'travelers',
    title: 'Travelers',
    component: TravelersLayoutComponent,
    children: [
      { path: '', component: TraleversComponent },
      { path: ':travelerId', component: TravelersDetailsComponent },
    ],
  },

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
    component: ActivitiesLayoutComponent,
    children: [
      { path: '', component: ActivitiesComponent },
      { path: ':activitieId', component: ActivitieDetailsComponent },
    ],
  },
  {
    path: 'profile',
    title: 'Profile',
    component: ProfileLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: 'edit', component: EditProfileComponent },
      {
        path: 'add-destination',
        component: AddDestinationComponent,
        canActivate: [isActivatedGuard],
      },
      { path: 'my-destinations', component: MyDestinationsComponent },
      { path: 'my-hotels', component: MyHotelComponent },
      {
        path: 'edit-destination/:id',
        component: EditDestinationComponent,
        canActivate: [editDestinationGuard],
      },
      {
        path: 'add-hotel',
        component: AddHotelComponent,
        canActivate: [isActivatedGuard],
      },
      {
        path: 'edit-hotel/:id',
        component: HotelEditComponent,
        canActivate: [isActivatedGuard, editHotelGuard],
      },
      { path: 'edit-profile', component: EditBusinessProfileComponent },
      {
        path: 'add-activities',
        component: AddActivitiesComponent,
        canActivate: [isActivatedGuard],
      },
      { path: 'my-activities', component: MyActivitiesComponent },
      {
        path: 'edit-activitie/:id',
        component: EditActivitieComponent,
        canActivate: [editActivitiesGuard],
      },
      { path: 'bookmarked', component: BookmarkedComponent },
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
