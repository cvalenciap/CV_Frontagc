import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appWordsOnly]'
})
export class WordsOnlyDirective {

  private teclasNoPermitidas: string[] = ['Tab'];
  private regExp: RegExp = new RegExp(/[a-zA-Z\s]+/g);
  private regExpReplace: RegExp = new RegExp(/[^a-zA-Z\s]*/g);

  constructor(private _el: ElementRef) { }

/*   @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const actual: string = this._el.nativeElement.value.trim();
    const siguiente: string = actual.concat(event.key);
    if (!this.regExp.test(siguiente)) {
      event.preventDefault();
    }
  } */

  @HostListener('input', ['$event'])
  onInputChange(event) {
    event.preventDefault();
    const valorInicial: string = this._el.nativeElement.value;
    this._el.nativeElement.value = valorInicial.replace(this.regExpReplace, '');
    if (valorInicial !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
