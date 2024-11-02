import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { ShapeMockupDirective } from '../shape-mockup.directive';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SetBgImageDirective, ShapeMockupDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {}
