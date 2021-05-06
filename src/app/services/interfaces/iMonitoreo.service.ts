import {Observable} from 'rxjs';
import { FiltrosBandejaAsignacion } from 'src/app/models/filtro-bandeja.asignacion';

export interface IMonitoreo {
    obtenerAsignaciones(request: FiltrosBandejaAsignacion): Observable<any>;
    consultarParametrosBusquedaAsignaciones(): Observable<any>;
    }