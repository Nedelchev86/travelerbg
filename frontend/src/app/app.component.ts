import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
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
import { NgxScrollTopComponent } from 'ngx-scrolltop';
import { environment } from '../environments/environment';
import { BreadcumbComponent } from './shared/components/breadcumb/breadcumb.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

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
    NgxScrollTopComponent,
    CommonModule,
    BreadcumbComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  public title = 'TravelerBG';
  public showBreadcrumb = true;
  private readonly API_URL = environment.apiUrl;
  public Editor = ClassicEditor;
  public config = {
    toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
    plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showBreadcrumb = event.urlAfterRedirects !== '/';
      });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.authService.currentUser.set(null);
      return;
    }

    this.http.get<UserInterface>(`${this.API_URL}user/`).subscribe({
      next: (data) => {
        this.authService.currentUser.set(data);
      },
      error: (error) => {
        if (error.status === 401) {
          this.authService.currentUser.set(null);
        }
      },
    });
  }
}
