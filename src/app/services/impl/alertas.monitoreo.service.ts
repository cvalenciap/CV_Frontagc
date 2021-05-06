import {Directive, Injectable, ɵConsole} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Response} from '../../models/';
import { AlertaTemplateRequest } from 'src/app/models/request/alerta-template-request';
@Injectable({
    providedIn: 'root',
  })
  export class AlertasMonitoreoService {
    private isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public  isLoading$ = this.isLoading.asObservable();
    private apiAlerta: string;
    constructor(private http: HttpClient) {
        this.apiAlerta = environment.serviceEndpoint  + '/api';
    }

    obtenerCrontab(): Observable<Response> {
        const url = `${this.apiAlerta}/crontab`;
        return this.http.get<Response>(url);
   }

    obtenerScripts(): Observable<Response> {
        const url = `${this.apiAlerta}/listash`;
        return this.http.get<Response>(url);
   }

   obtenerAlertasTemplate(): Observable<Response> {
    const url = `${this.apiAlerta}/templates`;
    return this.http.get<Response>(url);
   }

   obtenerAlertas(tipo: number): Observable<Response> {
    const url = `${this.apiAlerta}/alertas`;
    const params: HttpParams = new HttpParams()
    .set('v_v_tipo_query', tipo.toString());
    return this.http.get<Response>(url, {params});
   }

   obtenerAlertasQuerie(alerta: number, tipo: number): Observable<Response> {
    const url = `${this.apiAlerta}/alertas-queries`;
    const params: HttpParams = new HttpParams()
      .set('v_id_alerta', alerta.toString())
      .set('v_v_tipo_query', tipo.toString());
    return this.http.get<Response>(url, { params });
  }

  registrarAlertaTemplate(request: AlertaTemplateRequest): Observable<any> {
    const url = `${this.apiAlerta}/templates/insertar`;
    return this.http.post(url, request);
  }

  editarAlertaTemplate(request: AlertaTemplateRequest): Observable<any> {
    const url = `${this.apiAlerta}/templates/editar`;
    return this.http.post(url, request);
  }

  eliminarAlertaTemplate(request: AlertaTemplateRequest): Observable<any> {
    const url = `${this.apiAlerta}/templates/eliminar`;
    return this.http.post(url, request);
  }

  editarPeriodoAlerta(totalPeriodo: number): Observable<any> {
    const url = `${this.apiAlerta}/alerta/editar-periodo-alerta`;
    return this.http.post(url, totalPeriodo);
  }

  readMap(cronAlerta){
    const convMap = {};
    cronAlerta.forEach((val: string, key: string) => {
      convMap[key] = val;
    });
    return convMap
  }


  registrarAlertas(cronAlerta: Map<String, any>): Observable<any> {
        const url = `${this.apiAlerta}/editar-cron`;
        return this.http.post(url,  this.readMap(cronAlerta));
  }



  }
