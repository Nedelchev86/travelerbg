import { Component } from '@angular/core';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SetBgImageDirective, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {}
