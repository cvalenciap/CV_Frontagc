import { Directive, ElementRef, AfterViewInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoWhiteSpace]'
})
export class NoWhiteSpaceDirective {

  constructor(private el: ElementRef) { }

  private teclasNoPermitidas: Array<string> = ['Space', 'Tab', ' '];
  private regExp: RegExp = new RegExp(/\s/g);

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.teclasNoPermitidas.indexOf(event.key) !== -1) {
      event.preventDefault();
    }

    const valorActual: string = this.el.nativeElement.value.trim();
    const valorSiguiente: string = valorActual.concat(event.key).replace(this.regExp, '');
  }

}
