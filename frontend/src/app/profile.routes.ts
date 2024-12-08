import { Routes } from '@angular/router';
import { ProfileLayoutComponent } from './user/profile-layout/profile-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './user/profile/profile.component';
import { EditProfileComponent } from './user/editprofile/editprofile.component';
import { AddDestinationComponent } from './destination/add-destination/add-destination.component';
import { isActivatedGuard } from './guards/is-activated.guard';
import { isTravelerGuard } from './guards/is-traveler.guard';
import { MyDestinationsComponent } from './destination/my-destinations/my-destinations.component';
import { MyHotelComponent } from './hotel/my-hotel/my-hotel.component';
import { EditDestinationComponent } from './destination/edit-destination/edit-destination.component';
import { editDestinationGuard } from './guards/edit-destination.guard';
import { AddHotelComponent } from './hotel/add-hotel/add-hotel.component';
import { addHotelGuard } from './guards/add-hotel.guard';
import { HotelEditComponent } from './hotel/hotel-edit/hotel-edit.component';
import { editHotelGuard } from './guards/edit-hotel.guard';
import { EditBusinessProfileComponent } from './user/edit-business-profile/edit-business-profile.component';
import { AddActivitiesComponent } from './activity/add-activities/add-activities.component';
import { MyActivitiesComponent } from './activity/my-activities/my-activities.component';
import { editActivitiesGuard } from './guards/edit-activities.guard';
import { EditActivitieComponent } from './activity/edit-activitie/edit-activitie.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';

export const profileRoutes: Routes = [
  {
    path: '',
    title: 'Profile',
    component: ProfileLayoutComponent,

    data: { breadcrumb: 'Profile' },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ProfileComponent,
        data: { breadcrumb: 'Profile' },
      },
      {
        path: 'edit',
        component: EditProfileComponent,
        data: { breadcrumb: 'Edit Profile' },
      },
      {
        path: 'add-destination',
        component: AddDestinationComponent,
        data: { breadcrumb: 'Add destination' },
        canActivate: [isActivatedGuard, isTravelerGuard],
      },
      {
        path: 'my-destinations',
        component: MyDestinationsComponent,
        data: { breadcrumb: 'My Destinations' },
      },
      {
        path: 'my-hotels',
        component: MyHotelComponent,
        data: { breadcrumb: 'My Hotels' },
      },
      {
        path: 'edit-destination/:id',
        component: EditDestinationComponent,
        canActivate: [editDestinationGuard],
        data: { breadcrumb: 'Edit Destination' },
      },
      {
        path: 'add-hotel',
        component: AddHotelComponent,
        canActivate: [isActivatedGuard, addHotelGuard],
        data: { breadcrumb: 'Add Hotel' },
      },
      {
        path: 'edit-hotel/:id',
        component: HotelEditComponent,
        canActivate: [isActivatedGuard, editHotelGuard],
        data: { breadcrumb: 'Edit Hotel' },
      },
      {
        path: 'edit-profile',
        component: EditBusinessProfileComponent,
        data: { breadcrumb: 'Edit Profile' },
      },

      {
        path: 'add-activities',
        component: AddActivitiesComponent,
        canActivate: [isActivatedGuard],
        data: { breadcrumb: 'Add Activities' },
      },
      {
        path: 'my-activities',
        component: MyActivitiesComponent,
        data: { breadcrumb: 'My activity' },
      },
      {
        path: 'edit-activitie/:id',
        component: EditActivitieComponent,
        canActivate: [editActivitiesGuard],
        data: { breadcrumb: 'Edit Activity' },
      },
      {
        path: 'bookmarked',
        component: BookmarksComponent,
        data: { breadcrumb: 'Bookmarked' },
      },
    ],
  },
];
