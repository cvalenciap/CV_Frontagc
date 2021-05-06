import {Observable} from 'rxjs';
import {RequestEmpresa} from '../../models/request/request-empresa';

export interface IempresasService {
  consultarEmpresas(requestEmpresa: RequestEmpresa): Observable<any>;
}
