import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

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
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CKEditorModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
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

  private readonly API_URL = environment.apiUrl;
  public Editor = ClassicEditor;
  public config = {
    toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
    plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
    // licenseKey: '<YOUR_LICENSE_KEY>',
    // mention: {
    //     Mention configuration
    // }
  };

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('User is not logged in');
      this.authService.currentUser.set(null); // Clear any current user data
      // Optionally, you could redirect to the login page here
      return; // Exit early if no token exists
    }

    this.http.get<UserInterface>(`${this.API_URL}user/`).subscribe({
      next: (data) => {
        console.log(data);
        this.authService.currentUser.set(data);
        console.log('test', this.authService.currentUser());
      },
      error: (error) => {
        if (error.status === 401) {
          this.authService.currentUser.set(null);
          console.log('test');
        }
      },
    });
  }
}
