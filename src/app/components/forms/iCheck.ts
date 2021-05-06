// iCheck library is included in angular-cli script section
import {Directive, ElementRef, HostListener, Input, NgModule} from '@angular/core';

declare var $: any;

@Directive({
  selector: '[icheck]'
})

export class IcheckDirective {
  $: any = $;
  constructor(el: ElementRef) {
    this.$(el.nativeElement).iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    });
  }
}

@NgModule({
  declarations: [
    IcheckDirective
  ],
  exports: [
    IcheckDirective
  ],
  imports: []
})
export class IcheckModule { }
