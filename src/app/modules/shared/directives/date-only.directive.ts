import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appDateOnly]'
})
export class DateOnlyDirective {

    private patternOnlyNumbers: RegExp = /^\d+$/;
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home',
        'Divide', '/', 'Subtract', '-', 'ArrowLeft', 'Left', 'ArrowRight', 'Right', 'Control', 'Delete', 'Del'];

    @HostListener('keydown', ['$event'])
    validarInputDate(event: KeyboardEvent) {
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
        if (!this.patternOnlyNumbers.test(event.key)) {
            event.preventDefault();
        }
    }
}
