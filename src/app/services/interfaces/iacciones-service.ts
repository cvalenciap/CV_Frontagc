import {Observable} from 'rxjs';

export interface IAccionesService {
  consultarPermisos(N_IDPERFIL: number): Observable<any>;
}