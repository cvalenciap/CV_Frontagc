import {Observable} from 'rxjs';
import { FiltrosBandejaDigitalizados } from 'src/app/models/filtro-bandeja.digitalizado';
import { FiltrosBandejaLog } from 'src/app/models/filtro-bandeja.log';

export interface ILogDigitalizado {
    obtenerLogDigitalizados(request: FiltrosBandejaLog, pagina: number, registros: number): Observable<any>;
    generarArchivoExcelLogDigitalizados(request: FiltrosBandejaLog, pagina: number, registros: number): Observable<any>;
}
