import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DatosConsulta} from '../../models/datosConsulta';
import {RequestCarga} from '../../models/request/request-carga';

@Injectable({
  providedIn: 'root'
})
export class FiltrosService {
  private datosRegistro = new BehaviorSubject(new DatosConsulta());
  datosActuales = this.datosRegistro.asObservable();

  constructor() { }

  cambiarDatosRegistro(datosActuales: DatosConsulta) {
    this.datosRegistro.next(datosActuales);
  }

}
