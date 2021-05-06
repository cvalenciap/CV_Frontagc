import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numberOnly]'
})
export class NumberOnlyDirective {
  // Pattern only number
  private patternOnlyNumbers: RegExp = /^\d+$/;
  // Allow key codes for special events
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'Left', 'ArrowRight', 'Right', 'Control', 'Delete', 'Del'];

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    // CTRL + C
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 67) {
      return;
    }
    // CTRL +  V
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 86) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.patternOnlyNumbers)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(e: any) {
    if (window['clipboardData']) { // Internet Explorer
      event.preventDefault();
    } else { // Navegadores modernos
      const pastedText = e.clipboardData.getData('text');
      if (!this.patternOnlyNumbers.test(pastedText)) {
        event.preventDefault();
      }
    }
  }
  // onPaste(e: ClipboardEvent) {
  //   let clipboardData;
  //   const pastedText = e.clipboardData.getData('text');
  //   if (!this.patternOnlyNumbers.test(pastedText)) {
  //     event.preventDefault();
  //   }
  // }
}
