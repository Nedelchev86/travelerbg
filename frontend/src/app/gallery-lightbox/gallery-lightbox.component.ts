import { Component, Input, OnInit } from '@angular/core';
import {
  animate,
  style,
  transition,
  trigger,
  AnimationEvent,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { SetBgImageDirective } from '../set-bg-image.directive';

// interface Item {
//   imageSrc: string;
//   imageAlt: string;
// }

interface Item {
  imageSrc: string;
}
@Component({
  selector: 'app-gallery-lightbox',
  standalone: true,
  imports: [CommonModule, SetBgImageDirective],
  templateUrl: './gallery-lightbox.component.html',
  styleUrl: './gallery-lightbox.component.css',
  animations: [
    trigger('animation', [
      transition('void => visible', [
        style({ transform: 'scale(0.5)' }),
        animate('200ms', style({ transform: 'scale(1)' })),
      ]),
      transition('visible => void', [
        style({ transform: 'scale(1)' }),
        animate('200ms', style({ transform: 'scale(0.5)' })),
      ]),
    ]),
    trigger('animation2', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('50ms', style({ opacity: 0.8 })),
      ]),
    ]),
  ],
})
export class GalleryLightboxComponent implements OnInit {
  @Input() galleryData: Item[] = [];
  @Input() showCount = true;

  previewImage = false;
  showMask = false;
  currentLightboxImage: Item = this.galleryData[0];
  currentIndex = 0;
  controls = true;
  totalImageCount = 0;

  constructor() {}

  ngOnInit(): void {
    console.log(this.galleryData);
    this.totalImageCount = this.galleryData.length;
  }

  onPreviewImage(index: number): void {
    this.showMask = true;
    this.previewImage = true;
    this.currentIndex = index;
    this.currentLightboxImage = this.galleryData[index];
  }

  onAnimationEnd(event: AnimationEvent) {
    if (event.toState === 'void') {
      this.showMask = false;
    }
  }

  onClosePreview() {
    this.previewImage = false;
  }

  next(): void {
    this.currentIndex = this.currentIndex + 1;
    if (this.currentIndex > this.galleryData.length - 1) {
      this.currentIndex = 0;
    }
    this.currentLightboxImage = this.galleryData[this.currentIndex];
  }

  prev(): void {
    this.currentIndex = this.currentIndex - 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.galleryData.length - 1;
    }
    this.currentLightboxImage = this.galleryData[this.currentIndex];
  }
}
