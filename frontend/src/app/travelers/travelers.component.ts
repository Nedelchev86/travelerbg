import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-tralevers',
  standalone: true,
  imports: [SetBgImageDirective, RouterLink],
  templateUrl: './travelers.component.html',
  styleUrl: './travelers.component.css',
})
export class TraleversComponent {
  httpClient = inject(HttpClient);
  public data: Array<any> = [];
  ngOnInit() {
    this.httpClient.get('http://localhost:8000/api/travelers/').subscribe({
      next: (data: any) => {
        this.data = data;
      },
      error: (err) => console.log(err),
    });
  }
}
