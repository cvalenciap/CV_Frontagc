import {Directive, Injectable, ɵConsole} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Ciclo, CiclosDetalle} from '../../models';
import {environment} from '../../../environments/environment';
import {Response} from '../../models/';
import {Observable, BehaviorSubject} from 'rxjs';
import { ReportesRequest } from '../../models/request/reporte-request';
import { CicloRequest } from '../../models/request/ciclo-request';
import { CicloDetalleRequest } from 'src/app/models/request/ciclo-detalle-request';

@Injectable({
  providedIn: 'root',
})
export class CicloService {

    private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public  isLoading$ = this.isLoading.asObservable();
    private apiEndpoint: string;
    private apiEndpointDetalle: string;

    constructor(private http: HttpClient){
        this.apiEndpoint = environment.serviceEndpoint + '/api/ciclo';
        this.apiEndpointDetalle = environment.serviceEndpoint + '/api/ciclo-detalle';
    }

    obtenerCiclos(periodo: string,oficina: number): Observable<Response> {
        const url = `${this.apiEndpoint}/listado`;
        const params: HttpParams = new HttpParams()
          .set('periodo', periodo)
          .set('oficina', oficina.toString());
        return this.http.get<Response>(url, { params });
    }

    obtenerCiclosLista(idciclo: number): Observable<Response> {
      const url = `${this.apiEndpointDetalle}/listado`;
      const params: HttpParams = new HttpParams()
        .set('idciclo', idciclo.toString());
      return this.http.get<Response>(url, { params });
    }

    registrarCiclo(cicloRequest:CicloRequest): Observable<any> {
        const url = `${this.apiEndpoint}/registrar`;
        return this.http.post(url, cicloRequest);
    }

    eliminarCiclo(cicloRequest:CicloRequest): Observable<any>{
      const url = `${this.apiEndpoint}/eliminar`;
      return this.http.post(url, cicloRequest);
    }
    
    registrarCicloDetalle(cicloDetalleRequest: CicloDetalleRequest): Observable<any>{
      const url = `${this.apiEndpointDetalle}/registrar`;
      return this.http.post(url, cicloDetalleRequest);
    }

    eliminarCicloDetalle(cicloDetalleRequest: CicloDetalleRequest): Observable<any>{
      const url = `${this.apiEndpointDetalle}/eliminar`;
      return this.http.post(url, cicloDetalleRequest);
    }

}