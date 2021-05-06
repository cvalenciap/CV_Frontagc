import {Observable} from 'rxjs';
import { FiltrosBandejaDigitalizados } from 'src/app/models/filtro-bandeja.digitalizado';
import { RequestVisorDigitalizado } from 'src/app/models/request/request-visor-digitalizado';

export interface IDigitalizado {
    obtenerDigitalizados(request: FiltrosBandejaDigitalizados, pagina: number, registros: number): Observable<any>;
    generarArchivoExcelDigitalizados(request: FiltrosBandejaDigitalizados, pagina: number, registros: number): Observable<any>;
    consultarParametrosBusquedaDigitalizados(): Observable<any>;
    visualizarAdjuntosDigitalizados(request: RequestVisorDigitalizado): Observable<any>;
    registrarLogDigitalizado(request: RequestVisorDigitalizado) : Observable<any>;
    obtenerParametrosPeriodo(): Observable<any>;
    }