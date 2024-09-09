import { Component } from '@angular/core';
import { SetBgImageDirective } from '../set-bg-image.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShapeMockupDirective } from '../shape-mockup.directive';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SetBgImageDirective, ShapeMockupDirective],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainComponent {}
