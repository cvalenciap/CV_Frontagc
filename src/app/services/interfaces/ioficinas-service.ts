import {RequestOficina} from '../../models/request/request-oficina';
import {Observable} from 'rxjs';

export interface IoficinasService {
  consultarOficinas(requestOficinas: RequestOficina): Observable<any>;
}
