import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appHideOnError]',
  standalone: true
})
export class HideOnErrorDirective {
  private el = inject(ElementRef<HTMLImageElement>);

  // constructor() {
  //   this.el.nativeElement.style.visibility = 'hidden';
  // }

  @HostListener('load')
  onLoad() {
    this.el.nativeElement.style.visibility = 'visible';
    this.el.nativeElement.style.display = 'block';
  }

  @HostListener('error')
  onError() {
    this.el.nativeElement.style.display = 'none';
  }
}
