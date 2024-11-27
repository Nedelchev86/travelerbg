import { Component } from '@angular/core';
import { SetBgImageDirective } from '../../directives/set-bg-image.directive';
import { CommonModule } from '@angular/common';
import { BreadcumbComponent } from "../../shared/components/breadcumb/breadcumb.component";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SetBgImageDirective, CommonModule, BreadcumbComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {}
