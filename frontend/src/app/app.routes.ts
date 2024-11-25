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
import { AddActivitiesComponent } from './add-activities/add-activities.component';
import { MyActivitiesComponent } from './my-activities/my-activities.component';
import { editDestinationGuard } from './edit-destination.guard';
import { editHotelGuard } from './edit-hotel.guard';
import { EditActivitieComponent } from './edit-activitie/edit-activitie.component';
import { editActivitiesGuard } from './edit-activities.guard';
import { ActivitieDetailsComponent } from './activitie-details/activitie-details.component';
import { ActivitiesLayoutComponent } from './activities-layout/activities-layout.component';
import { isActivatedGuard } from './is-activated.guard';
import { TravelersLayoutComponent } from './travelers-layout/travelers-layout.component';
import { BookmarkedComponent } from './bookmarked/bookmarked.component';

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
