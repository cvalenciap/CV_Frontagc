import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appMayusculas]'
})
export class MayusculasDirective {

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    this.value = $event.target.value.toUpperCase();
    this.ngModelChange.emit(this.value);
  }
}
