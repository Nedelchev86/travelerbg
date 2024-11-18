import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { TraleversComponent } from './travelers/travelers.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { DestinationDetailsComponent } from './destination-details/destination-details.component';
import { ActivitiesComponent } from './activities/activities.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { ProfileComponent } from './profile/profile.component';
import { AddDestinationComponent } from './add-destination/add-destination.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { RatingComponent } from './rating/rating.component';
import { DestinationsByUserComponent } from './destinations-by-user/destinations-by-user.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserInterface } from './user-interface';
import { CloudinaryModule } from '@cloudinary/ng';
import { GoogleMapsModule } from '@angular/google-maps';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
} from 'ckeditor5';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    CKEditorModule,
    RouterOutlet,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    TraleversComponent,
    DestinationsComponent,
    DestinationDetailsComponent,
    ActivitiesComponent,
    LoginRegisterComponent,
    ProfileComponent,
    AddDestinationComponent,
    LoaderComponent,
    RatingComponent,
    DestinationsByUserComponent,
    CloudinaryModule,
    GoogleMapsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'frontend';
  http = inject(HttpClient);
  authService = inject(AuthService);

  public Editor = ClassicEditor;
  public config = {
    toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
    plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
    licenseKey: '<YOUR_LICENSE_KEY>',
    // mention: {
    //     Mention configuration
    // }
  };

  ngOnInit() {
    this.http.get<UserInterface>('http://localhost:8000/api/user/').subscribe({
      next: (data) => {
        console.log(data);
        this.authService.currentUser.set(data);
        console.log('test', this.authService.currentUser());
      },
      error: (error) => {
        if (error.status === 401) {
          console.log('test');
          return;
        }

        this.authService.currentUser.set(null);
      },
    });
  }
}
