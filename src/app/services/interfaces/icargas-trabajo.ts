import {Observable} from 'rxjs';
import {RequestCarga} from '../../models/request/request-carga';
import { Paginacion } from 'src/app/models';

export interface IcargasTrabajo {
  consultarCargasTrabajo(requestCarga: RequestCarga, pagina: number, registros: number): Observable<any>;
  obtenerSize(): Observable<any>;
}


