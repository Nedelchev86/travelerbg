import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appShapeMockup]', // You can use 'appShapeMockup' as the directive name
  standalone: true,
})
export class ShapeMockupDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;

    const top = element.getAttribute('data-top');
    const right = element.getAttribute('data-right');
    const bottom = element.getAttribute('data-bottom');
    const left = element.getAttribute('data-left');

    if (top) {
      this.renderer.setStyle(element, 'top', top);
      this.renderer.removeAttribute(element, 'data-top');
    }
    if (right) {
      this.renderer.setStyle(element, 'right', right);
      this.renderer.removeAttribute(element, 'data-right');
    }
    if (bottom) {
      this.renderer.setStyle(element, 'bottom', bottom);
      this.renderer.removeAttribute(element, 'data-bottom');
    }
    if (left) {
      this.renderer.setStyle(element, 'left', left);
      this.renderer.removeAttribute(element, 'data-left');
    }

    // Add parent class "shape-mockup-wrap"
    const parent = this.el.nativeElement.parentElement;
    if (parent) {
      this.renderer.addClass(parent, 'shape-mockup-wrap');
    }
  }
}
