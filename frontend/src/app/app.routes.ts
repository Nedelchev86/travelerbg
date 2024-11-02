import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { TraleversComponent } from './travelers/travelers.component';
import { TravelersDetailsComponent } from './travelers-details/travelers-details.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { DestinationDetailsComponent } from './destination-details/destination-details.component';
import { HotelsComponent } from './hotels/hotels.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'travelers',
    title: 'Travelers',
    children: [
      { path: '', component: TraleversComponent },
      { path: ':travelerId', component: TravelersDetailsComponent },
    ],
  },

  // {
  //   path: 'travelers/:travelerId',
  //   component: TravelersDetailsComponent,
  // },

  {
    path: 'destinations',
    title: 'Destinations',
    children: [
      { path: '', component: DestinationsComponent },
      { path: ':destinationId', component: DestinationDetailsComponent },
    ],
  },

  // {
  //   path: 'destinations/:destinationId',
  //   component: DestinationDetailsComponent,
  // },

  {
    path: 'hotels',
    title: 'Hotels',
    component: HotelsComponent,
    // children: [{ path: 'post', component: PostHotelComponent }],
  },
];
