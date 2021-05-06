import { Pipe, PipeTransform  } from '@angular/core';

@Pipe({ name: 'periododate' })

export class PeriodoPipe implements PipeTransform {

    transform(value: string) {
        let year = value.substr(0,4);
        let mes = value.substr(4);
        let date = '';

        switch(mes) { 
            case '01': { 
                date = year +' - ' + 'Enero';
               break; 
            } 
            case '02': { 
                date = year +' - ' + 'Febrero';
               break; 
            } 
            case '03': { 
                date = year +' - ' + 'Marzo';
               break; 
            } 
            case '04': { 
                date = year +' - ' + 'Abril';
               break; 
            } 
            case '05': { 
                date= year +' - ' + 'Mayo';
               break; 
            } 
            case '06': { 
                date = year +' - ' +  'Junio';
               break; 
            } 
            case '07': { 
                date = year +' - ' +  'Julio';
               break; 
            } 
            case '08': { 
                date = year +' - ' + 'Agosto';
               break; 
            } 
            case '09': { 
                date = year +' - ' + 'Setiembre';
               break; 
            } 
            case '10': { 
                date = year +' - ' +  'Octubre';
               break; 
            } 
            case '11': { 
                date = year +' - ' + 'Noviembre';
               break; 
            } 
            default: { 
                date = year +' - ' + 'Diciembre';
               break; 
            } 
         } 
      return date;
    }
}