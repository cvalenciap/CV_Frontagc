import {RequestParametro} from '../../models/request/request-parametro';
import {Observable} from 'rxjs';

export interface IparametrosService {
  consultarParametros(requestParametro: RequestParametro,pagina: number, registros: number): Observable<any>;
}
