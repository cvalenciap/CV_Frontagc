import {RequestActividad} from '../../models/request/request-actividad';
import {Observable} from 'rxjs';

export interface IactividadesService {
  consultarActividades(requestActividad: RequestActividad): Observable<any>;
}
