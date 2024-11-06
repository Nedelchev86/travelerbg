import { Component } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SetBgImageDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {}
