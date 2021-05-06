import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8',
  'Accept': 'application/json; charset=UTF-8' })
};

@Injectable({
  providedIn: 'root'
})
export class ValidacionService  {  

  constructor() {    
  }

  /* Solo se ingresa Letras Y Numero*/
  validacionSoloLetras(item: any) {
    let validador
    validador = item.keycode || item.which;
    let tecla = String.fromCharCode(validador).toString();
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890";
    let especiales = [8, 6];
    let tecla_especial = false
    for (var i in especiales) {
      if (validador == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      return false;
    }

  }

  validacionSoloNumeros(item: any) {
    let validador
    validador = item.keycode || item.which;
    let tecla = String.fromCharCode(validador).toString();
    let letras = "1234567890";
    let especiales = [8, 6];
    let tecla_especial = false
    for (var i in especiales) {
      if (validador == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      return false;
    }

  }


}
