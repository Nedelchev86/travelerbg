import { Routes } from '@angular/router';
import { TraleversComponent } from './traveler/travelers/travelers.component';
import { TravelersDetailsComponent } from './traveler/travelers-details/travelers-details.component';
import { DestinationDetailsComponent } from './destination/destination-details/destination-details.component';
import { ActivitiesComponent } from './activity/activities/activities.component';
import { ContactComponent } from './core/contact/contact.component';
import { AuthGuard } from './guards/auth.guard';
import { DestinationsLayoutComponent } from './destination/destinations-layout/destinations-layout.component';
import { HotelsLayoutComponent } from './hotel/hotels-layout/hotels-layout.component';
import { ActivitieDetailsComponent } from './activity/activitie-details/activitie-details.component';
import { ActivitiesLayoutComponent } from './activity/activities-layout/activities-layout.component';
import { TravelersLayoutComponent } from './traveler/travelers-layout/travelers-layout.component';
import { DestinationsComponent } from './destination/destinations/destinations.component';
import { HotelsComponent } from './hotel/hotels/hotels.component';
import { HotelDetailsComponent } from './hotel/hotel-details/hotel-details.component';
import { MainComponent } from './core/main/main.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { breadcrumb: 'Home' },
    title: 'TravelerBg',
  },
  {
    path: 'travelers',
    component: TravelersLayoutComponent,
    title: 'Travelers',
    data: { breadcrumb: 'Travelers' },
    children: [
      {
        path: '',
        component: TraleversComponent,
        data: { breadcrumb: 'Travelers' },
      },
      {
        path: ':travelerId',
        component: TravelersDetailsComponent,
        data: { breadcrumb: 'Traveler Details' },
      },
    ],
  },

  {
    path: 'destinations',
    title: 'Destinations',
    data: { breadcrumb: 'Destinations' },
    component: DestinationsLayoutComponent,
    children: [
      {
        path: '',
        component: DestinationsComponent,
        data: { breadcrumb: 'Destinations' },
      },
      {
        path: ':destinationId',
        component: DestinationDetailsComponent,
        data: { breadcrumb: 'Destination Details' },
      },
    ],
  },
  {
    path: 'hotels',
    title: 'Hotels',
    component: HotelsLayoutComponent,
    data: { breadcrumb: 'Hotels' },
    children: [
      { path: '', component: HotelsComponent, data: { breadcrumb: 'Hotels' } },
      {
        path: ':hotelId',
        component: HotelDetailsComponent,
        data: { breadcrumb: 'Hotel Details' },
      },
    ],
  },
  {
    path: 'activities',
    title: 'Activities',
    component: ActivitiesLayoutComponent,
    data: { breadcrumb: 'Activities' },
    children: [
      {
        path: '',
        component: ActivitiesComponent,
      },
      {
        path: ':activitieId',
        component: ActivitieDetailsComponent,
        data: { breadcrumb: 'Activity Details' },
      },
    ],
  },
  // {
  //   path: 'profile',
  //   title: 'Profile',
  //   component: ProfileLayoutComponent,

  //   data: { breadcrumb: 'Profile' },
  //   canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: '',
  //       component: ProfileComponent,
  //       data: { breadcrumb: 'Profile' },
  //     },
  //     {
  //       path: 'edit',
  //       component: EditProfileComponent,
  //       data: { breadcrumb: 'Edit Profile' },
  //     },
  //     {
  //       path: 'add-destination',
  //       component: AddDestinationComponent,
  //       data: { breadcrumb: 'Add destination' },
  //       canActivate: [isActivatedGuard, isTravelerGuard],
  //     },
  //     {
  //       path: 'my-destinations',
  //       component: MyDestinationsComponent,
  //       data: { breadcrumb: 'My Destinations' },
  //     },
  //     {
  //       path: 'my-hotels',
  //       component: MyHotelComponent,
  //       data: { breadcrumb: 'My Hotels' },
  //     },
  //     {
  //       path: 'edit-destination/:id',
  //       component: EditDestinationComponent,
  //       canActivate: [editDestinationGuard],
  //       data: { breadcrumb: 'Edit Destination' },
  //     },
  //     {
  //       path: 'add-hotel',
  //       component: AddHotelComponent,
  //       canActivate: [isActivatedGuard, addHotelGuard],
  //       data: { breadcrumb: 'Add Hotel' },
  //     },
  //     {
  //       path: 'edit-hotel/:id',
  //       component: HotelEditComponent,
  //       canActivate: [isActivatedGuard, editHotelGuard],
  //       data: { breadcrumb: 'Edit Hotel' },
  //     },
  //     {
  //       path: 'edit-profile',
  //       component: EditBusinessProfileComponent,
  //       data: { breadcrumb: 'Edit Profile' },
  //     },

  //     {
  //       path: 'add-activities',
  //       component: AddActivitiesComponent,
  //       canActivate: [isActivatedGuard],
  //       data: { breadcrumb: 'Add Activities' },
  //     },
  //     {
  //       path: 'my-activities',
  //       component: MyActivitiesComponent,
  //       data: { breadcrumb: 'My activity' },
  //     },
  //     {
  //       path: 'edit-activitie/:id',
  //       component: EditActivitieComponent,
  //       canActivate: [editActivitiesGuard],
  //       data: { breadcrumb: 'Edit Activity' },
  //     },
  //     {
  //       path: 'bookmarked',
  //       component: BookmarksComponent,
  //       data: { breadcrumb: 'Bookmarked' },
  //     },
  //   ],
  // },
  {
    path: 'profile',
    title: 'Profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./profile.routes').then((m) => m.profileRoutes),
  },
  {
    path: 'contact-us',
    title: 'Contact Us',
    component: ContactComponent,
    data: { breadcrumb: 'Contsct Us' },
  },
  { path: '404', component: PageNotFoundComponent },
  {
    path: '**',
    redirectTo: '/404',
  },
];
