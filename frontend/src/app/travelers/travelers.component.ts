import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-tralevers',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink],
  templateUrl: './travelers.component.html',
  styleUrl: './travelers.component.css',
})
export class TraleversComponent {
  authService = inject(AuthService);
  httpClient = inject(HttpClient);
  public data: Array<any> = [];
  ngOnInit() {
    this.httpClient.get('http://localhost:8000/api/travelers/').subscribe({
      next: (data: any) => {
        this.data = data;
        console.log(this.authService.currentUser());
      },
      error: (err) => console.log(err),
    });
  }
}
