import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSetBgImage]',
  standalone: true,
})
export class SetBgImageDirective implements OnInit {
  @Input('appSetBgImage') bgImageUrl: string = ''; // Input property for the image URL

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Set the background image using the Renderer2 to ensure safe DOM manipulation
    if (this.bgImageUrl) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'background-image',
        `url(${this.bgImageUrl})`
      );
      this.renderer.setStyle(this.el.nativeElement, 'background-size', 'cover');
      this.renderer.setStyle(
        this.el.nativeElement,
        'background-position',
        'center'
      );
    }
  }
}
