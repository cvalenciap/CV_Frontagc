import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumericOnly]'
})
export class NumericOnlyDirective {
  private teclasPermitidas: Array<string> = ['Tab', 'Control', 'Backspace', 'Copy', 'ArrowLeft', 'ArrowRight',
  'v', 'V', 'c', 'C', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  constructor(private _el: ElementRef) { }


  @HostListener('input', ['$event'])
  onInputChange(event) {
    event.preventDefault();
    const valorInicial = this._el.nativeElement.value;
    this._el.nativeElement.value = valorInicial.replace(/[^0-9]*/g, '');
    if (valorInicial !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.teclasPermitidas.indexOf(event.key) === -1) {
      event.preventDefault();
    }

    const valorActual: string = this._el.nativeElement.value.trim();
    const valorSiguiente: string = valorActual.concat(event.key).replace(/[^0-9]*/g, '');
  }

}
