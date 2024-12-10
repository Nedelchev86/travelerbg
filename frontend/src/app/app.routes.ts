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
import { validHotelIdGuard } from './guards/valid-hotel-id.guard';
import { validDestinationIdGuard } from './guards/valid-destination-id.guard';
import { validActivityIdGuard } from './guards/valid-activity-id.guard';
import { validTravelerIdGuard } from './guards/valid-traveler-id.guard';

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
        canActivate: [validTravelerIdGuard],
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
        canActivate: [validDestinationIdGuard],
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
        canActivate: [validHotelIdGuard],
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
        canActivate: [validActivityIdGuard],
        data: { breadcrumb: 'Activity Details' },
      },
    ],
  },

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
