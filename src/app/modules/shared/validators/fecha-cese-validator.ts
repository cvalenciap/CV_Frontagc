import { AbstractControl } from '@angular/forms';

export function ValidarFechaCese(control: AbstractControl): {[key: string]: boolean} | null {
  if (control.value !== undefined && control.value > new Date()) {
    return {'fechaMax': true};
  }
  return null;
}
